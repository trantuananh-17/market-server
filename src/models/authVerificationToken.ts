import { Document, model, Schema } from "mongoose";
import { hash, compare, genSalt } from "bcrypt";

interface AuthDocument extends Document {
  owner: Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const TokenSchema = new Schema<AuthDocument, {}, Methods>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 86400, // 60 * 60 * 24
    default: Date.now(),
  },
});

TokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    const salt = await genSalt(10);
    this.token = await hash(this.token, salt);
  }
  next();
});

TokenSchema.methods.compareToken = async function (token) {
  return await compare(token, this.token);
};

const AuthVerificationToken = model("AuthVerificationToken", TokenSchema);
export default AuthVerificationToken;
