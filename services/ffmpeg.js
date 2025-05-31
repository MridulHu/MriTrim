import { FFmpegKit } from 'ffmpeg-kit-react-native';

export const trimMedia = async (inputPath, outputPath, startTime, duration) => {
  const cmd = `-i "${inputPath}" -ss ${startTime} -t ${duration} -c copy "${outputPath}"`;
  const session = await FFmpegKit.execute(cmd);
  const returnCode = await session.getReturnCode();
  if (!returnCode.isValueSuccess()) {
    throw new Error(`Trimming failed with return code: ${returnCode}`);
  }
  return outputPath;
};

export const mergeAudios = async (input1, input2, output) => {
  const cmd = `-i "${input1}" -i "${input2}" -filter_complex "[0:0][1:0]concat=n=2:v=0:a=1[out]" -map "[out]" "${output}"`;
  const session = await FFmpegKit.execute(cmd);
  const returnCode = await session.getReturnCode();
  if (!returnCode.isValueSuccess()) {
    throw new Error(`Merging failed with return code: ${returnCode}`);
  }
  return output;
};
