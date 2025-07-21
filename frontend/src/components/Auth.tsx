import { type SignUpInput } from "@eivor1000/medium-common";
import type { ChangeEvent } from "react";
import { Link , useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {BACKEND_URL} from "../../config.ts"

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignUpInput>({
    name: "",
    username: "",
    password: "",
  });

  async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            const jwt = response.data;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch(e) {
            alert("Error while signing up")
            // alert the user here that the request failed
        }
    }

  return (
    <div className="h-screen flex justify-center items-center bg-white">
      <div className="w-80">
        <div className="text-center px-4">
          <div className="text-3xl font-extrabold">
            {type === "signup" ? "Create an account" : "Welcome back"}
          </div>
          <div className="text-slate-500 mt-1 text-sm">
            {type === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
            <Link
              className="pl-2 underline text-black"
              to={type === "signin" ? "/signup" : "/signin"}
            >
              {type === "signin" ? "Sign up" : "Sign in"}
            </Link>
          </div>
        </div>

        <div className="pt-8">
          {type === "signup" && (
            <LabelledInput
              label="Name"
              placeholder="Harkirat Singh..."
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  name: e.target.value,
                });
              }}
            />
          )}
          <LabelledInput
            label="Username"
            placeholder="harkirat@gmail.com"
            onChange={(e) => {
              setPostInputs({
                ...postInputs,
                username: e.target.value,
              });
            }}
          />
          <LabelledInput
            label="Password"
            type="password"
            placeholder="123456"
            onChange={(e) => {
              setPostInputs({
                ...postInputs,
                password: e.target.value,
              });
            }}
          />
          <button
          onClick={sendRequest}
            type="button"
            className="mt-8 w-full text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            {type === "signup" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-black focus:border-black block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
