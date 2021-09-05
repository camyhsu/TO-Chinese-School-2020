# Check Missing Form

This is a utility script to check which student does not have the required 
form submitted.


## Background

For the school year 2021-2022, the school administration requires the parents 
of every student to fill out an acknowledgement form, agreed that they will 
perform symptom checks and close contact checks against COVID-19 each week 
before bringing the students to the campus for classes.  This is a one-time 
acknowledgement, but the every student is required to have one on-file.

It is typical that some parents would need multiple reminders before they 
fill out the form.  However, the school administration would like to target 
the reminders more specifically to the parents who still have not filled out 
the form instead of many broad and ineffective notifications to all parents.  
Hence, we need a tool to quickly figure out which students still do not have 
the required form submitted at a given time.

This script is written for this need.  It takes the list of all registered 
students and the list of form submissions (done as Google Form), then figure 
out which students do not have the corresponding form submitted.


## Usage

This script is written with Python 3.8 and is intended to be executed in a 
terminal environment.  It takes two CSV files as input, one containing data 
about currently registered students, and the other containing data of existing 
Google Form submissions.  It then generates a CSV file as output listing 
students who do not have submitted forms together with their family contact 
information.

The command format to execute the script is:
```shell
python3 check_missing_form.py <registered_students_csv> <form_submitted_students_csv> <missing_form_students_csv>
```
where 
* *<registered_students_csv>* is the path to the CSV file containing registered student data
* *<form_submitted_students_csv>* is the path to the CSV file containing google form submission data 
* *<missing_form_students_csv>* is the path to the intended output file

Note that any existing file at the output path will be overridden by the script. 
Details of the exact CSV file format / columns can be inspected through the 
sample test data files in the *tests/data* directory.

The main script itself is the one located at *src/check_missing_form/check_missing_form.py*


## Development Notes

This development notes section assumes that the reader is familiar with basic 
Python programming concepts such as python / pip / virtual-environment, etc.

The script *check_missing_form.py* does not depend on any additional library. 
It only needs Python 3.8 and its standard library.  However, the repository 
contains tests which do depend on 3rd party libraries such as pytest.  The 
list of development dependencies are frozen into the file *requirements-dev.txt*

To run tests, the main script itself must be installed as a local package.  If 
script code editing is expected, the local package needs to be editable.  As an 
example, the command to install it as an editable package from the parent 
directory of the *check_missing_form* directory tree is:
```shell
pip install -e ./check_missing_form/
```

All code in this directory tree is formatted with *black*.  Please follow the 
same convention and run *black* to format all code before changes are committed 
to the repository.  The command to execute *black* from the root of the 
*check_missing_form* directory tree is:
```shell
black .
```
