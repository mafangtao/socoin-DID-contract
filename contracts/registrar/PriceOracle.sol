pragma solidity >=0.4.24;

interface PriceOracle {
    /**
     * @dev Returns the price to register or renew a name.
     * @param name The name being registered or renewed.
     * @return The price of this renewal or registration, in wei.
     */
    function price(string calldata name) external view returns(uint);
}
