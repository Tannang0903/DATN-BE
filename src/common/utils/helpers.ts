export const validateBirth = (dob: Date) => {
  const age = new Date().getFullYear() - new Date(dob).getFullYear() + 1
  return age >= 18
}
