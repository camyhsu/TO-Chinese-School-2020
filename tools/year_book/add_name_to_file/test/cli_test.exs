defmodule CLITest do
  use ExUnit.Case
  import ExUnit.CaptureIO

  import AddNameToFile.CLI, only: [parse_args: 1, process: 1]

  @test_resource_directory "test/resources"
  @test_name_data_file "test/resources/test_name_data.csv"

  test "parse_args should return :help by option parsing with -h and --help options" do
    assert :help == parse_args(["-h", "anything"])
    assert :help == parse_args(["--help", "anything"])
    assert :help == parse_args(["--help", "--dry-run"])
    assert :help == parse_args(["--help", "--dry-run", "path/to/file", "/dir1/dir2"])
  end

  test "parse_args should return name data file and root directory if they are given" do
    assert {"path/to/file", "/dir1/dir2", false} == parse_args(["path/to/file", "/dir1/dir2"])
  end

  test "parse_args should return name data file and root directory with dry_run flag if they are given" do
    assert {"path/to/file", "/dir1/dir2", true} ==
             parse_args(["--dry-run", "path/to/file", "/dir1/dir2"])
  end

  test "parse_args should return :help if the arguments are not recognized" do
    assert :help == parse_args([])
    assert :help == parse_args(["root_directory"])
  end

  test "process should return usage information if :help is given" do
    result = capture_io(fn -> process(:help) end)

    assert "usage:  add_name_to_file [-h | --help] [--dry-run] <data_file_path> <root_directory>\n" ==
             result
  end

  test "process dry run" do
    result = capture_io(fn -> process({@test_name_data_file, @test_resource_directory, true}) end)

    assert "Renaming test/resources/images/1A/7240.jpg to test/resources/images/1A/Rachel_Mandel_陸敏慧_7240.jpg\n" <>
             "Renaming test/resources/images/1A/6118.jpg to test/resources/images/1A/Bennett_Lee_李景軒_6118.jpg\n" <>
             "Renaming test/resources/images/1A/7510.jpg to test/resources/images/1A/Isabella_Lee__7510.jpg\n" <>
             "Renaming test/resources/images/1A/7128.jpg to test/resources/images/1A/Celina_Lin__7128.jpg\n" ==
             result
  end
end
