defmodule AddNameWorkerTest do
  use ExUnit.Case

  import AddNameToFile.AddNameWorker,
    only: [find_jpg_file_paths: 1, jpg_file_path?: 1, extract_student_id_from_old_name: 1]

  @test_resource_directory "test/resources"

  test "find_jpg_file_paths should return a list of jpg file paths" do
    files_found = find_jpg_file_paths(@test_resource_directory)
    assert 9 == length(files_found)
    assert Path.join(@test_resource_directory, "images/test1.jpg") in files_found
    assert Path.join(@test_resource_directory, "images/test2.JPG") in files_found
    assert Path.join(@test_resource_directory, "images/test3.jpeg") in files_found
    assert Path.join(@test_resource_directory, "images/test4.JPEG") in files_found
    assert Path.join(@test_resource_directory, "images/1A/6118.jpg") in files_found
    assert Path.join(@test_resource_directory, "images/1A/7128.jpg") in files_found
    assert Path.join(@test_resource_directory, "images/1A/7240.jpg") in files_found
    assert Path.join(@test_resource_directory, "images/1A/7510.jpg") in files_found
    assert Path.join(@test_resource_directory, "images/1A/7600.jpg") in files_found
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

  test "extract_student_id_from_old_name should return correct student id" do
    assert "1234" == extract_student_id_from_old_name("1234.jpg")
    assert "1234" == extract_student_id_from_old_name("1234.jpeg")
    assert "1234" == extract_student_id_from_old_name("1234.JPG")
    assert "1234" == extract_student_id_from_old_name("1234.JPEG")
    assert "1234" == extract_student_id_from_old_name("abc_1234.jpg")
  end

  test "extract_student_id_from_old_name should return nil if no match" do
    assert nil == extract_student_id_from_old_name("abc.jpg")
  end
end
