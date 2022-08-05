// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

//Designer hubs is a platform where creatives come to seek other designers from other fields and expertise to
//to join their creative abilities in carrying out and completing a particular project, the designers in turn
//book a spot by buying gigs

contract Designershub {
    uint internal designersLength = 1;
    uint internal projectsLength = 0;
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Designer {
        address payable designer;
        string expertise;
        string name;
        string onlinePortfolio;
        string location;
        uint yearsExperience;
        uint price;
        bool onContract;
    }

    // Structure of a project
    struct Project {
        // admin of the project
        address admin;
        // winner is the choosen applicant for the project
        address winner;
        string name;
        string description;
        // bool to check if users can still apply
        bool available;
        // completed keeps track of if a user has finished the current project
        bool completed;
    }

    mapping(uint => Designer) private designers;
    // maps id of a designer to its wallet address
    mapping(address => uint) public designerId;
    mapping(uint => Project) public projects;
    // keeps track of designers that created a profile
   mapping(address => bool) public isMember;
    mapping(uint => address[]) public appliedToProject;
    mapping(uint => mapping(address => bool)) public applied;

    modifier onlyDesigner(uint _designerId) {
        require(
            msg.sender == designers[_designerId].designer,
            "You are not the designer"
        );
        _;
    }

    modifier isProjectAdmin(uint _projectId) {
        require(msg.sender == projects[_projectId].admin, "Unauthorized user");
        _;
    }

    modifier checkIfMember() {
        require(isMember[msg.sender], "You need to sign up first");
        _;
    }

    /// @dev allows a user to create a profile 
    function uploadProfile(
        string calldata _expertise,
        string calldata _name,
        string calldata _onlinePortfolio,
        string calldata _location,
        uint _yearsExperience,
        uint _price
    ) external {
        require(_price > 0, "Invalid price");
        require(bytes(_expertise).length > 0, "Empty expertise");
        require(bytes(_name).length > 0, "Empty name");
        require(bytes(_onlinePortfolio).length > 0, "Empty portfolio url");
        require(bytes(_location).length > 0, "Empty location");
        designers[designersLength] = Designer(
            payable(msg.sender),
            _expertise,
            _name,
            _onlinePortfolio,
            _location,
            _yearsExperience,
            _price,
            false
        );
        isMember[msg.sender] = true;
        designerId[msg.sender] = designersLength;
        designersLength++;
    }

    /// @dev upload a design
    function uploadDesignjobs(
        string calldata _name,
        string calldata _description
    ) external {
        require(bytes(_name).length > 0, "Empty name");
        require(bytes(_description).length > 0, "Empty description");
        projects[projectsLength] = Project(
            msg.sender,
            address(0),
            _name,
            _description,
            true,
            false
        );
        projectsLength++;
    }

    function getDesigner(uint _designerId)
        public
        view
        returns (Designer memory)
    {
        return designers[_designerId];
    }

    /// @dev allow users to delete their profile
    function removeDesigner(uint _designerId)
        external
        checkIfMember()
        onlyDesigner(_designerId)
    {
        require(!designers[_designerId].onContract, "You have pending jobs");
        designers[_designerId] = designers[designersLength - 1];
        delete designers[designersLength - 1];
        delete designerId[msg.sender];
        exists[designersLength - 1] = false;
        isMember[msg.sender] = false;
        designersLength--;
    }

    /// @dev allows registered users to apply for a job
    function ApplyToProject(uint _projectId) public checkIfMember() {
        require(
            !designers[designerId[msg.sender]].onContract,
            "Already working on another project"
        );
        require(!applied[_projectId][msg.sender], "Already applied");
        appliedToProject[_projectId].push(msg.sender);
        applied[_projectId][msg.sender] = true;
    }

    /// @dev allows a project admin to choose a winner from the applicants
    function ChooseDesigner(uint _projectId, address _winner)
        public
        isProjectAdmin(_projectId)
    {
        require(
            applied[_projectId][_winner],
            "This user hasn't applied for this project"
        );
        require(
            !designers[designerId[_winner]].onContract,
            "This designer is already working on another project"
        );
        require(projects[_projectId].available, "Project isn't available");
        projects[_projectId].winner = _winner;
        projects[_projectId].available = false;
        designers[designerId[_winner]].onContract = true;
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                payable(_winner),
                designers[designerId[_winner]].price
            ),
            "Transfer failed."
        );
    }

    /// @dev allows a project admin to end a gig
    function endContract(uint _projectId) public isProjectAdmin(_projectId) {
        require(!projects[_projectId].available, "Project isn't available");
        require(!projects[_projectId].completed, "Already completed");
        projects[_projectId].completed = true;
        address designer = projects[_projectId].winner;
        designers[designerId[designer]].onContract = false;
    }

    function getDesignsLength() public view returns (uint) {
        return (designersLength);
    }

    function getProjectsLength() public view returns (uint) {
        return (projectsLength);
    }
}
