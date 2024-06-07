import { Types } from "mongoose";

export type TGender = "male" | "Female";
export type TReligion = "male" | "Female";

export type TStudent = {
  classRoll: number;
  studentName: string;
  dateOfBirth: Date;
  gender: TGender;
  class: Types.ObjectId;
  createdBy: Types.ObjectId;
  religion: TReligion;
  placeOfBirth: string;
  nationality: string;
  firstLanguage: string;
  presentAddress: string;
  permanentAddress: string;
  isDeleted: boolean;

  fatherName: string;
  fatherEmail: string;
  fatherPhonNumber: string;
  fatherIDCardNumber: string;
  fatherProfession: string;
  fatherPesignation: string;

  motherName: string;
  motherEmail: string;
  motherPhonNumber: string;
  motherIDCardNumber: string;
  motherProfession: string;
  motherPesignation: string;
};
