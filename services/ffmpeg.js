import { FFmpegKit } from 'ffmpeg-kit-react-native';

export const trimMedia = async (inputPath, outputPath, startTime, duration) => {
  const cmd = `-i ${inputPath} -ss ${startTime} -t ${duration} -c copy ${outputPath}`;
  await FFmpegKit.execute(cmd);
};

export const mergeAudios = async (input1, input2, output) => {
  const cmd = `-i ${input1} -i ${input2} -filter_complex "[0:0][1:0]concat=n=2:v=0:a=1[out]" -map "[out]" ${output}`;
  await FFmpegKit.execute(cmd);
};
