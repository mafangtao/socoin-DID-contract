pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./SOCIToken.sol";

contract ZeroDAOCFO {
  using SafeERC20 for IERC20;

  SOCIToken private _soci;

  // ERC20 basic token contract being held
  IERC20 private _token;

  // beneficiary of tokens after they are released
  address private _beneficiary;

  // timestamp when token release is enabled
  uint256 private _releaseTime;

    constructor (IERC20 token, address beneficiary, uint256 releaseTime, address soci) public {
        require(releaseTime > block.timestamp, "TokenTimelock: release time is before current time");
        _token = token;
        _soci = SOCIToken(soci);
        _beneficiary = beneficiary;
        _releaseTime = releaseTime;
    }

    // 上次发工资时间
    uint256 private _lastWages;

     /**
     * @notice 领工资啦
     */
    function wages() public {
        require(block.timestamp >= _lastWages + 30 days, "TokenTimelock: current time is before release time");
        uint256 amount = _token.balanceOf(address(this));
        require((amount / 100) > 0, "TokenTimelock: no tokens to release");
        _lastWages = block.timestamp;
        _token.safeTransfer(_beneficiary, amount / 100);
    }

    /**
     * @return 上次发工资时间
     */
    function lastWages() public view returns (uint256) {
        return _lastWages;
    }

    /**
      * @return the token being held.
      */
    function token() public view returns (IERC20) {
        return _token;
    }

    /**
      * @return the SCOI being held.
      */
    function soci() public view returns (SOCIToken) {
        return _soci;
    }

    /**
      * @return the beneficiary of the tokens.
      */
    function beneficiary() public view returns (address) {
        return _beneficiary;
    }

    /**
     * @return the time when the tokens are released.
     */
    function releaseTime() public view returns (uint256) {
        return _releaseTime;
    }

    /**
     * @notice Transfers tokens held by timelock to beneficiary.
     */
    function release() public {
        // solhint-disable-next-line not-rely-on-time
        require(block.timestamp >= _releaseTime, "TokenTimelock: current time is before release time");

        uint256 amount = _token.balanceOf(address(this));
        require(amount > 0, "TokenTimelock: no tokens to release");

        _token.safeTransfer(_beneficiary, amount);
    }

    /**
     * @notice 设置owner权限
     */
    function setTokenOwner(address newOwner) public {
        // solhint-disable-next-line not-rely-on-time
        require(msg.sender == _beneficiary);
        require(block.timestamp >= _releaseTime, "Wrong time, wrong place");
        _soci.transferOwnership(newOwner);
    }
}
