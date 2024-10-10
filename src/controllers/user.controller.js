import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //1. get user details from frontend

  //2. validation - not empty

  //3. check if user already exist: username or email

  //4. check for images, check for avatar(compulsory)

  //5. upload them to cloudinary, avatar

  //6. create user object - create entry in db

  //7.remove password and refresh token field from response

  //8. check for user creation

  //9. return res

  //2nd
  const { fullName, email, username, password } = req.body;
  console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "") //checks if it is empty or niot after trimming
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //3rd
  // User.findOne({email})

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  //console.log(existedUser)

  if (existedUser) {
    throw new ApiError(409, "User with same username or email existed");
  }

  //4th
  const avatarLocalPath = req.files?.avatar[0]?.path; //  The line req.files?.avatar[0]?.path safely retrieves the file path of the first uploaded file from the avatar field, if it exists, using optional chaining.

  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  //5th
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  //6th
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered succesfully"));
});

export { registerUser };
