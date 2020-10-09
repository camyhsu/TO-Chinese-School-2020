# AddNameToFile

**TODO: Add description**

## Installation

If [available in Hex](https://hex.pm/docs/publish), the package can be installed
by adding `add_name_to_file` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:add_name_to_file, "~> 0.1.0"}
  ]
end
```

Documentation can be generated with [ExDoc](https://github.com/elixir-lang/ex_doc)
and published on [HexDocs](https://hexdocs.pm). Once published, the docs can
be found at [https://hexdocs.pm/add_name_to_file](https://hexdocs.pm/add_name_to_file).

## To build an executable

```bash
cd tools/year_book/add_name_to_file
mix escript.build

```

## To run the executable

```bash
./add_name_to_file [-h | --help] [--dry-run] <data_file_path> <root_directory>mix escript.build
```
example: 

```bash
./add_name_to_file  ~/workspace/tocs/TOCS_data_file/student_list_for_yearbook_20200118.csv ~/workspace/tocs/TOCS_data_file/photo_dir
```


## Troulbe Shooting
coild not find Hex, which is needed to build dependency :csv
```bash
mix deps.get
```
