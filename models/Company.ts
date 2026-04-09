import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICompany extends Document {
  name: string;
  sector: string;
  logoUrl: string;
  headquarters: string;
  foundedYear: number;
  netWorth: string;
}

const CompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  sector: { type: String, required: true },
  logoUrl: { type: String, required: true },
  headquarters: { type: String, required: true },
  foundedYear: { type: Number, required: true },
  netWorth: { type: String, required: true }
}, {
  timestamps: true
});

export const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
export default Company;
