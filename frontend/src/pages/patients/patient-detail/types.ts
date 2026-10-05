export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const EMPTY_RECORD_FORM = {
  primaryDiagnosis: "",
  medicalHistory: "",
  allergies: "",
  bloodType: "",
};

export type RecordFormValue = typeof EMPTY_RECORD_FORM;
