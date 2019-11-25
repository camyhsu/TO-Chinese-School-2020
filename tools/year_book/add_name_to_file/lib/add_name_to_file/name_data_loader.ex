defmodule AddNameToFile.NameDataLoader do
  def load(data_file_path) do
    File.stream!(data_file_path, encoding: :utf8)
    |> CSV.decode!(headers: true)
    |> Enum.to_list()
  end
end
