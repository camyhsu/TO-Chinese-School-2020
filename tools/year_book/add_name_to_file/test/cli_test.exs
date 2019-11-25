defmodule CLITest do
  use ExUnit.Case
  import ExUnit.CaptureIO

  import AddNameToFile.CLI, only: [parse_args: 1, process: 1]

  test "parse_args should return :help by option parsing with -h and --help options" do
    assert parse_args(["-h", "anything"]) == :help
    assert parse_args(["--help", "anything"]) == :help
  end

  test "parse_args should return name data file and root directory if they are given" do
    assert parse_args(["path/to/file", "/dir1/dir2"]) == {"path/to/file", "/dir1/dir2"}
  end

  test "parse_args should return :help if the arguments are not recognized" do
    assert parse_args([]) == :help
    assert parse_args(["root_directory"]) == :help
  end

  test "process should return usage information if :help is given" do
    result = capture_io(fn -> process(:help) end)
    assert result == "usage:  add_name_to_file <root_directory>\n"
  end
end
