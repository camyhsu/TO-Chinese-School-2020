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

  def construct_new_file_path(file_path, name_data_map) do
    student_id = extract_student_id_from_old_name(Path.basename(file_path))
    student_id_replacement = Map.get(name_data_map, student_id, student_id)
    String.replace(file_path, student_id, student_id_replacement)
  end

  def replace_file_name(file_path, name_data_map, dry_run) do
    new_file_path = construct_new_file_path(file_path, name_data_map)

    unless new_file_path == file_path do
      IO.puts("Renaming #{file_path} to #{new_file_path}")

      unless dry_run do
        File.rename!(file_path, new_file_path)
      end
    end
  end

  def replace_file_names(jpg_file_paths, name_data_map, dry_run) do
    jpg_file_paths
    |> Enum.each(&replace_file_name(&1, name_data_map, dry_run))
  end
end
