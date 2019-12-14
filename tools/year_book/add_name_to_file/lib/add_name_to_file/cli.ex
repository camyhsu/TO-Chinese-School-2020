defmodule AddNameToFile.CLI do
  @moduledoc """
  Handle the command line parsing and the dispatch to various functions.
  """

  import AddNameToFile.AddNameWorker, only: [find_jpg_file_paths: 1, replace_file_names: 3]

  def main(argv) do
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
    parse =
      OptionParser.parse(argv, strict: [help: :boolean, dry_run: :boolean], aliases: [h: :help])

    case parse do
      {[help: true], _, _} ->
        :help

      {[help: true, dry_run: _], _, _} ->
        :help

      {[dry_run: true], [data_file_path, root_directory], _} ->
        {data_file_path, root_directory, true}

      {_, [data_file_path, root_directory], _} ->
        {data_file_path, root_directory, false}

      _ ->
        :help
    end
  end

  def process(:help) do
    IO.puts(
      "usage:  add_name_to_file [-h | --help] [--dry-run] <data_file_path> <root_directory>"
    )
  end

  def process({data_file_path, root_directory, dry_run}) do
    name_data_map = AddNameToFile.NameDataLoader.load(data_file_path)

    find_jpg_file_paths(root_directory)
    |> replace_file_names(name_data_map, dry_run)
  end
end
