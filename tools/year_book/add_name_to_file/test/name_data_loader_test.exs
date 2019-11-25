defmodule NameDataLoaderTest do
  use ExUnit.Case

  import AddNameToFile.NameDataLoader, only: [load: 1, create_name_string: 1]

  @test_name_data_file "test/resources/test_name_data.csv"

  test "load should load the csv data file into a map of student id to name" do
    result = load(@test_name_data_file)

    assert result == %{
             "6118" => "6118_Bennett_Lee_李景軒",
             "6698" => "6698_Victoria_Chiu_邱凱蒂",
             "6703" => "6703_Sebastien_Ho_何敏求",
             "6787" => "6787_Joy_Huang_黄静然",
             "7006" => "7006_Remy_Lai_賴君睿",
             "7128" => "7128_Celina_Lin_",
             "7166" => "7166_Ryan_Ho_何彦君",
             "7240" => "7240_Rachel_Mandel_陸敏慧",
             "7510" => "7510_Isabella_Lee_"
           }
  end

  test "create_name_string should construct the name string based on the record given" do
    assert "6118_Bennett_Lee_李景軒" ==
             create_name_string(%{
               "Chinese Name" => "李景軒",
               "Class" => "1A",
               "First Name" => "Bennett",
               "Gender" => "M",
               "Last Name" => "Lee",
               "Student ID" => "6118"
             })

    assert "7128_Celina_Lin_" ==
             create_name_string(%{
               "Chinese Name" => "",
               "Class" => "1A",
               "First Name" => "Celina",
               "Gender" => "F",
               "Last Name" => "Lin",
               "Student ID" => "7128"
             })
  end
end
