defmodule AddNameToFile.AddNameWorker do
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
end
