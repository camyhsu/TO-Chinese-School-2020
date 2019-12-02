defmodule AddNameWorkerTest do
  use ExUnit.Case

  import AddNameToFile.AddNameWorker, only: [find_jpg_file_paths: 1, jpg_file_path?: 1]

  @test_resource_directory "test/resources"

  test "find_jpg_file_paths should return a list of jpg file paths" do
    assert [
             Path.join(@test_resource_directory, "images/test1.jpg"),
             Path.join(@test_resource_directory, "images/test2.JPG"),
             Path.join(@test_resource_directory, "images/test3.jpeg"),
             Path.join(@test_resource_directory, "images/test4.JPEG")
           ] == find_jpg_file_paths(@test_resource_directory)
  end

  test "jpg_file_path? should return false if the path is not a file" do
    assert false == jpg_file_path?(@test_resource_directory)
  end

  test "jpg_file_path? should return false if the path is a file but not a jpg file" do
    assert false == jpg_file_path?(Path.join(@test_resource_directory, "test_name_data.csv"))
  end

  test "jpg_file_path? should return true if the path is a file named with suffix .jpg" do
    assert true == jpg_file_path?(Path.join(@test_resource_directory, "images/test1.jpg"))
  end

  test "jpg_file_path? should return true if the path is a file named with suffix .JPG" do
    assert true == jpg_file_path?(Path.join(@test_resource_directory, "images/test2.JPG"))
  end

  test "jpg_file_path? should return true if the path is a file named with suffix .jpeg" do
    assert true == jpg_file_path?(Path.join(@test_resource_directory, "images/test3.jpeg"))
  end

  test "jpg_file_path? should return true if the path is a file named with suffix .JPEG" do
    assert true == jpg_file_path?(Path.join(@test_resource_directory, "images/test4.JPEG"))
  end
end
