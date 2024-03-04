// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DescionBNBMarketplace {
  struct Review {
      address reviewer;
      string content;
      uint256 timestamp;
      uint positiveVotes;
      uint negativeVotes;
  }

    struct Paper {
        string title;
        string author;
        string content;
        uint256 timestamp;
        uint256 funding;
        bool isReproducible;
        address payable owner;
        PaperStage stage;
        // more than 1 owners for a paper
        mapping(address => bool) owners;
        address treasuryaddress;
        // quad voting
        mapping(address => uint) positiveVotes; // user => weight
        mapping(address => uint) negativeVotes; // user => weight
        uint totalPositiveWeight;
        uint totalNegativeWeight;
        Review[] paperReviews;
        address accessnftaddress;
    }

    enum PaperStage { Approved, Rejected, Published }

    mapping(uint256 => Paper) public papers;
    uint256 public paperCount;
    // cost of voting
    uint constant public voteCost = 1;
    mapping(address => bool) public members;

    event PaperUploaded(uint256 indexed paperId, string title, string author, uint256 timestamp, PaperStage stage);
    event PaperStageUpdated(uint256 indexed paperId, PaperStage stage);
    event FundingUpdated(uint256 indexed paperId, uint256 funding);
    event Voted(uint paperId, uint weight, bool positive);
    event ReviewVoted(uint256 indexed paperId, uint256 reviewIndex, bool isPositive, address voter);
    event RewardsDistributed(uint256 indexed paperId);
      // Mapping from paper ID to list of reviews
    mapping(uint256 => Review[]) public paperReviews;

        constructor() {
        members[msg.sender] = true;
    }


  /**
     * @dev Allows users to submit reviews for a specific paper.
     * @param paperId Identifier of the paper to review.
     * @param content Review content.
     */ 
  function submitReview(uint256 paperId, string memory content) external {
      paperReviews[paperId].push(Review({
          reviewer: msg.sender,
          content: content,
          timestamp: block.timestamp,
          positiveVotes: 0,
          negativeVotes: 0
      }));
  }

  event ReviewSubmitted(uint256 indexed paperId, address reviewer, string content, uint256 timestamp);

/**
     * @dev Enables voting on a specific review.
     * @param paperId Identifier of the paper.
     * @param reviewIndex Index of the review in the paper's review array.
     * @param isPositive Boolean indicating if the vote is positive or negative.
     */
function voteOnReview(uint256 paperId, uint256 reviewIndex, bool isPositive) external {
    Review storage review = paperReviews[paperId][reviewIndex];
    if (isPositive) {
        review.positiveVotes += 1;
    } else {
        review.negativeVotes += 1;
    }

    emit ReviewVoted(paperId, reviewIndex, isPositive, msg.sender);
}
   /**
     * @dev Modifier to restrict function access to members only.
    */
    modifier onlyMembers() {
        require(members[msg.sender], "Only members can call this function");
        _;
    }

    function addMember(address member) external onlyMembers {
        members[member] = true;
    }

    function removeMember(address member) external onlyMembers {
        members[member] = false;
    }


    /**
     * @dev Uploads a new paper to the platform.
     * @param title Title of the paper.
     * @param author Author of the paper.
     * @param content Content of the paper.
     * @param funding Initial funding allocated to the paper.
     * @param isReproducible Indicates if the paper's results are reproducible.
     * @param stage Initial stage of the paper.
     * @param treasuryAddress Address of the treasury for reward distribution.
     * @param accessNFTAddress Address of the associated access NFT.
     */
    function uploadPaper(string memory title, string memory author, string memory content, uint256 funding, bool isReproducible, PaperStage stage , address _treasuryaddress , address _accessnftaddress) external {
        uint256 timestamp = block.timestamp;
        uint256 paperId = paperCount + 1;
        Paper storage newPaper = papers[paperId];
        newPaper.title = title;
        newPaper.owner = payable(msg.sender);
        newPaper.author = author;
        newPaper.content = content;
        newPaper.timestamp = timestamp;
        newPaper.funding = funding;
        newPaper.isReproducible = isReproducible;
        newPaper.stage = stage;
        newPaper.treasuryaddress = _treasuryaddress;
        papers[paperId].owners[msg.sender] = true;
        paperCount++;
        newPaper.accessnftaddress = _accessnftaddress;
        emit PaperUploaded(paperId, title, author, timestamp, stage);
    }

   /**
     * @dev Updates the stage of a paper.
     * @param paperId Identifier of the paper.
     * @param stage New stage to set.
     */
    function updatePaperStage(uint256 paperId, PaperStage stage) public onlyMembers {
        require(paperId <= paperCount, "Invalid paperId");
        papers[paperId].stage = stage;

        emit PaperStageUpdated(paperId, stage);
    }

    /**
     * @dev Updates the funding for a paper.
     * @param paperId Identifier of the paper.
     * @param newFunding New funding amount.
     */
    function updateFunding(uint256 paperId, uint256 newFunding) external {
        require(paperId <= paperCount, "Invalid paperId");
        require(papers[paperId].owners[msg.sender], "You can only update funding for your own paper");

        papers[paperId].funding = newFunding;

        emit FundingUpdated(paperId, newFunding);
    }

    function addPaperOwner(uint256 paperId, address newOwner) external {
        require(paperId <= paperCount, "Invalid paperId");
        require(!papers[paperId].owners[newOwner], "Owner already exists for this paper");
        require(msg.sender == papers[paperId].owner, "Only the paper owner can add new owners");
        papers[paperId].owners[newOwner] = true;
    }

    function removePaperOwner(uint256 paperId, address owner) external {
        require(paperId <= paperCount, "Invalid paperId");
        require(papers[paperId].owners[owner], "Owner does not exist for this paper");
        require(msg.sender == papers[paperId].owner, "Only the paper owner can remove owners");
        papers[paperId].owners[owner] = false;
    }

    // helper functions
  function currentWeight(uint paperId, address addr, bool isPositive) public view returns(uint) {
    if (isPositive) {
      return papers[paperId].positiveVotes[addr];
    } else {
      return papers[paperId].negativeVotes[addr];
    }
  }

  function calcCost(uint currWeight, uint weight) public pure returns(uint) {
    if (currWeight > weight) {
      return weight * weight * voteCost; // cost is always quadratic
    } else if (currWeight < weight) {
      // this allows users to save on costs if they are increasing their vote
      // example: current weight is 3, they want to change it to 5
      // this would cost 16x (5 * 5 - 3 * 3) instead of 25x the vote cost
      return (weight * weight - currWeight * currWeight) * voteCost;
    } else {
      return 0;
    }
  }
    // helper functions end

    function positiveVote(uint paperId, uint weight) public payable {
    Paper storage paper = papers[paperId];
    require(msg.sender != paper.owner); // owners cannot vote on their own papers

    uint currWeight = paper.positiveVotes[msg.sender];
    if (currWeight == weight) {
      return; // no need to process further if vote has not changed
    }

    uint cost = calcCost(currWeight, weight);
    require(msg.value >= cost); // msg.value must be enough to cover the cost

    paper.positiveVotes[msg.sender] = weight;
    paper.totalPositiveWeight += weight - currWeight;

    // weight cannot be both positive and negative simultaneously
    paper.totalNegativeWeight -= paper.negativeVotes[msg.sender];
    paper.negativeVotes[msg.sender] = 0;

    paper.funding += msg.value; // reward creator of paper for their contribution

    emit Voted(paperId, weight, true);
  }

  function negativeVote(uint paperId, uint weight) public payable {
    Paper storage paper = papers[paperId];
    require(msg.sender != paper.owner);

    uint currWeight = paper.negativeVotes[msg.sender];
    if (currWeight == weight) {
      return; // no need to process further if vote has not changed
    }

    uint cost = calcCost(currWeight, weight);
    require(msg.value >= cost); // msg.value must be enough to cover the cost

    paper.negativeVotes[msg.sender] = weight;
    paper.totalNegativeWeight += weight - currWeight;

    // weight cannot be both positive and negative simultaneously
    paper.totalPositiveWeight -= paper.positiveVotes[msg.sender];
    paper.positiveVotes[msg.sender] = 0;

    // distribute voting cost to every paper except for this one
    uint reward = msg.value / (paperCount - 1);
    for (uint i = 0; i < paperCount; i++) {
      if (i != paperId) papers[i].funding += reward;
    }

    emit Voted(paperId, weight, false);
  }

    function claim(uint paperId) public {
        Paper storage paper = papers[paperId];
        require(msg.sender == paper.owner);
        paper.owner.transfer(paper.funding);
        paper.funding = 0;
    }

    function distributeRewards(uint256 paperId) public {
        // Distributing rewards to the paper owner and top reviewer

        require(msg.sender == papers[paperId].owner || members[msg.sender], "Only the paper owner or the DAO member can distribute rewards");

        uint256 totalReward = papers[paperId].funding;
        uint256 paperOwnerReward = totalReward * 80 / 100; // 80% to paper owner
        uint256 topReviewerReward = totalReward * 20 / 100; // 20% to top reviewer

        Paper storage paper = papers[paperId];
        address payable paperOwner = paper.owner;
        paperOwner.transfer(paperOwnerReward);

        uint256 topReviewIndex = 0;
        uint256 maxVotes = 0;
        for (uint256 i = 0; i < paperReviews[paperId].length; i++) {
            if (paperReviews[paperId][i].positiveVotes > maxVotes) {
                topReviewIndex = i;
                maxVotes = paperReviews[paperId][i].positiveVotes;
            }
        }

        address payable topReviewer = payable(paperReviews[paperId][topReviewIndex].reviewer);
        topReviewer.transfer(topReviewerReward);

        emit RewardsDistributed(paperId);
    }
    
}