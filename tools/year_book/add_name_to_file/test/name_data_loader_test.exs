defmodule NameDataLoaderTest do
  use ExUnit.Case

  import AddNameToFile.NameDataLoader, only: [load: 1, create_name_string: 1]

  @test_name_data_file "test/resources/test_name_data.csv"

  test "load should load the csv data file into a map of student id to name" do
    result = load(@test_name_data_file)

    assert %{
             "6118" => "Bennett_Lee_李景軒_6118",
             "6698" => "Victoria_Chiu_邱凱蒂_6698",
             "6703" => "Sebastien_Ho_何敏求_6703",
             "6787" => "Joy_Huang_黄静然_6787",
             "7006" => "Remy_Lai_賴君睿_7006",
             "7128" => "Celina_Lin__7128",
             "7166" => "Ryan_Ho_何彦君_7166",
             "7240" => "Rachel_Mandel_陸敏慧_7240",
             "7510" => "Isabella_Lee__7510"
           } == result
  end

  test "create_name_string should construct the name string based on the record given" do
    assert "Bennett_Lee_李景軒_6118" ==
             create_name_string(%{
               "Chinese Name" => "李景軒",
               "Class" => "1A",
               "First Name" => "Bennett",
               "Gender" => "M",
               "Last Name" => "Lee",
               "Student ID" => "6118"
             })

    assert "Celina_Lin__7128" ==
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
