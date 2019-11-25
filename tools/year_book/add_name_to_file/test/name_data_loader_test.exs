defmodule NameDataLoaderTest do
  use ExUnit.Case

  import AddNameToFile.NameDataLoader, only: [load: 1]

  @test_name_data_file "test/resources/test_name_data.csv"

  test "load should load the csv data file into a map of student id to name" do
    result = load(@test_name_data_file)
    IO.inspect(result)
  end
end
