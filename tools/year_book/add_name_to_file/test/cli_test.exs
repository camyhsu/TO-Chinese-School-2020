defmodule CLITest do
  use ExUnit.Case
  import ExUnit.CaptureIO

  import AddNameToFile.CLI, only: [parse_args: 1, process: 1]

  @test_resource_directory "test/resources"
  @test_name_data_file "test/resources/test_name_data.csv"

  test "parse_args should return :help by option parsing with -h and --help options" do
    assert parse_args(["-h", "anything"]) == :help
    assert parse_args(["--help", "anything"]) == :help
    assert parse_args(["--help", "--dry-run"]) == :help
    assert parse_args(["--help", "--dry-run", "path/to/file", "/dir1/dir2"]) == :help
  end

  test "parse_args should return name data file and root directory if they are given" do
    assert parse_args(["path/to/file", "/dir1/dir2"]) == {"path/to/file", "/dir1/dir2", false}
  end

  test "parse_args should return name data file and root directory with dry_run flag if they are given" do
    assert parse_args(["--dry-run", "path/to/file", "/dir1/dir2"]) ==
             {"path/to/file", "/dir1/dir2", true}
  end

  test "parse_args should return :help if the arguments are not recognized" do
    assert parse_args([]) == :help
    assert parse_args(["root_directory"]) == :help
  end

  test "process should return usage information if :help is given" do
    result = capture_io(fn -> process(:help) end)
    assert result == "usage:  add_name_to_file [-h | --help] [--dry-run] <data_file_path> <root_directory>\n"
  end

  test "process dry run" do
    process({@test_name_data_file, @test_resource_directory, true})
  end
end
