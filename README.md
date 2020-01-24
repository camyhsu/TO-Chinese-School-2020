# TO-Chinese-School-2020
Second generation application code used by Thousand Oaks Chinese School

## To build an executable
### cd tools/year_book/add_name_to_file
### mix escript.build

## To run the executable
### ./add_name_to_file [-h | --help] [--dry-run] <data_file_path> <root_directory>
### example: ./add_name_to_file  ~/workspace/tocs/TOCS_data_file/student_list_for_yearbook_20200118.csv ~/workspace/tocs/TOCS_data_file/photo_dir


## Troulbe Shooting
### coild not find Hex, which is needed to build dependency :csv
#### mix deps.get 
