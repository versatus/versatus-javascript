import { Contract } from './Contract.js'

export class ERC721Contract extends Contract {
  constructor(name, symbol) {
    super()
    this.CONTRACT_NAME = name
    this.CONTRACT_SYMBOL = symbol
    this.owners = {}
    this.tokens = {}
    this.tokenURIs = {}

    // Initialize method strategies
    this.methodStrategies = {
      name: this.name.bind(this),
      symbol: this.symbol.bind(this),
      balanceOf: this.balanceOf.bind(this),
      ownerOf: this.ownerOf.bind(this),
      transfer: this.transfer.bind(this),
      tokenURI: this.tokenURI.bind(this),
    }
  }

  // Method implementations
  name() {
    return { name: this.CONTRACT_NAME, success: true }
  }

  symbol() {
    return { symbol: this.CONTRACT_SYMBOL, success: true }
  }

  balanceOf(accountInfo) {
    const address = accountInfo.accountAddress
    return { balance: this.tokens[address]?.length ?? 0, success: true }
  }

  ownerOf(contractInput) {
    const tokenId = contractInput.functionInputs.erc721.tokenId
    return {
      owner: this.owners[tokenId] ?? null,
      success: !!this.owners[tokenId],
    }
  }

  transfer(accountInfo, contractInput) {
    const { from, to, tokenId } = contractInput.functionInputs.erc721
    if (this.owners[tokenId] !== from) return { success: false }

    this.owners[tokenId] = to
    this.tokens[from] = this.tokens[from].filter((id) => id !== tokenId)
    if (!this.tokens[to]) this.tokens[to] = []
    this.tokens[to].push(tokenId)

    return { success: true }
  }

  tokenURI(contractInput) {
    const tokenId = contractInput.functionInputs.erc721.tokenId
    return {
      uri: this.tokenURIs[tokenId] ?? null,
      success: !!this.tokenURIs[tokenId],
    }
  }

  // Additional methods for managing tokens and URIs
  mint(to, tokenId, uri) {
    this.owners[tokenId] = to
    if (!this.tokens[to]) this.tokens[to] = []
    this.tokens[to].push(tokenId)
    this.tokenURIs[tokenId] = uri
  }

  burn(tokenId) {
    const owner = this.owners[tokenId]
    if (!owner) return { success: false }

    delete this.owners[tokenId]
    this.tokens[owner] = this.tokens[owner].filter((id) => id !== tokenId)
    delete this.tokenURIs[tokenId]

    return { success: true }
  }
}
