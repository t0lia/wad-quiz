import { section1States } from './section-1'
import { section2StandardStates } from './section-2-standard'
import { section2UnsignedStates } from './section-2-unsigned'
import { section3States } from './section-3'
import { section4CargoStates } from './section-4-cargo'
import { section5CargoStates } from './section-5-cargo'
import { section6CargoStates } from './section-6-cargo'
import { section4MedicalStates } from './section-4-medical'
import { section5MedicalStates } from './section-5-medical'
import { section6MedicalStates } from './section-6-medical'
import { section7States } from './section-7'
import { section8CleanStates } from './section-8-clean'
import { section8DebtStates } from './section-8-debt'
import { section9States } from './section-9'
import { section10CleanStates } from './section-10-clean'
import { section10DebtStates } from './section-10-debt'
import { endingStates } from './endings'

export const allMachineStates = {
  ...section1States,
  ...section2StandardStates,
  ...section2UnsignedStates,
  ...section3States,
  ...section4CargoStates,
  ...section5CargoStates,
  ...section6CargoStates,
  ...section4MedicalStates,
  ...section5MedicalStates,
  ...section6MedicalStates,
  ...section7States,
  ...section8CleanStates,
  ...section8DebtStates,
  ...section9States,
  ...section10CleanStates,
  ...section10DebtStates,
  ...endingStates,
}
