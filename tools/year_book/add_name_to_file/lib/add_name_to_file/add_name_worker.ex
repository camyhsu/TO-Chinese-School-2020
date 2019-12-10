defmodule AddNameToFile.AddNameWorker do
  @student_id_extraction_pattern ~r"\D*(\d+).(jpg|jpeg)"i

  def find_jpg_file_paths(path) do
    cond do
      jpg_file_path?(path) -> [path]
      File.dir?(path) -> dig_into_directory(path)
      true -> []
    end
  end

  def jpg_file_path?(path) do
    File.regular?(path) and String.ends_with?(path, [".jpg", ".JPG", ".jpeg", ".JPEG"])
  end

  def dig_into_directory(directory_path) do
    File.ls!(directory_path)
    |> Enum.map(&Path.join(directory_path, &1))
    |> Enum.map(&find_jpg_file_paths/1)
    |> Enum.concat()
  end

  def extract_student_id_from_old_name(old_name) do
    match_result = Regex.run(@student_id_extraction_pattern, old_name)

    if match_result == nil do
      match_result
    else
      Enum.at(match_result, 1)
    end
  end

  def replace_file_name(jpg_file_paths, name_data_map) do
  end
end
