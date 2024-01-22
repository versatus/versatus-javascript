export interface ContractInput {
  version: number
  accountInfo: AccountInfo
  function: string
  inputs: Inputs
}

export interface AccountInfo {
  programNamespace: string
  linkedPrograms: LinkedPrograms
  data: string
}

export interface LinkedPrograms {
  [key: string]: LinkedProgram
}

export type LinkedProgram = Record<string, any>

export type Inputs = Record<string, any>
