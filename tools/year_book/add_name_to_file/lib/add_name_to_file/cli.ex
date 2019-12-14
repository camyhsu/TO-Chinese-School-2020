defmodule AddNameToFile.CLI do
  @moduledoc """
  Handle the command line parsing and the dispatch to various functions.
  """

  import AddNameToFile.AddNameWorker, only: [find_jpg_file_paths: 1, replace_file_names: 2]

  def run(argv) do
    argv
    |> parse_args
    |> process
  end

  @doc """
  `argv` can be -h or --help, which returns :help.

  Otherwise they are the data file path and a root directory to scan for JPG files to be renamed.

  Return a tuple of `{data_file_path, root_directory}` or `:help` if help was given.
  """
  def parse_args(argv) do
    parse = OptionParser.parse(argv, switches: [help: :boolean], aliases: [h: :help])

    case parse do
      {[help: true], _, _} -> :help
      {_, [data_file_path, root_directory], _} -> {data_file_path, root_directory}
      _ -> :help
    end
  end

  def process(:help) do
    IO.puts("usage:  add_name_to_file <root_directory>")
  end

  def process(data_file_path, root_directory) do
    name_data_map = AddNameToFile.NameDataLoader.load(data_file_path)

    find_jpg_file_paths(root_directory)
    |> replace_file_names(name_data_map)
  end
end
