// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VeritasToken is ERC20Votes, Ownable {
    constructor() ERC20("Veritas DAO", "VTS") ERC20Permit("Veritas DAO") Ownable(msg.sender) {
        _mint(msg.sender, 10_000_000 * 10 ** decimals()); // 10M Initial Supply to Admin
    }

    // Overrides required by Solidity

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
