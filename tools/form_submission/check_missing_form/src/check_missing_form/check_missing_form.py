from collections import namedtuple

import csv
import pathlib
import sys


RegisteredStudent = namedtuple(
    "RegisteredStudent",
    ["first_name", "last_name", "class_name", "family_email", "family_phone"],
)

FormSubmittedStudent = namedtuple(
    "FormSubmittedStudent",
    ["first_name", "last_name", "class_name", "submission_email", "timestamp"],
)


def same_student(registered_student, form_submitted_student):
    if (
        registered_student.first_name.lower()
        != form_submitted_student.first_name.lower()
        or registered_student.last_name.lower()
        != form_submitted_student.last_name.lower()
        or registered_student.class_name != form_submitted_student.class_name
    ):
        return False
    else:
        return True


def normalize_class_name(input_class_name):
    if input_class_name == "PreA":
        return "PreK A"
    else:
        return input_class_name


def read_registered_students_from_csv(registered_students_csv_file_path):
    with registered_students_csv_file_path.open() as csv_file:
        csv_reader = csv.reader(csv_file)
        line_count = 0
        registered_students = []
        for row in csv_reader:
            if line_count == 0:
                # print(f'Column names are {", ".join(row)}')
                line_count += 1
            else:
                registered_students.append(
                    RegisteredStudent(
                        row[1].strip(),
                        row[2].strip(),
                        normalize_class_name(row[0]),
                        row[6].strip(),
                        row[7],
                    )
                )
                line_count += 1

    print(f"Processed {line_count} lines.")
    print(f"{len(registered_students)} registered students collected.")
    return registered_students


def read_form_submitted_students_from_csv(form_submitted_students_csv_file_path):
    with form_submitted_students_csv_file_path.open() as csv_file:
        csv_reader = csv.reader(csv_file)
        line_count = 0
        form_submitted_students = []
        for row in csv_reader:
            if line_count == 0:
                # print(f'Column names are {", ".join(row)}')
                line_count += 1
            else:
                form_submitted_students.append(
                    FormSubmittedStudent(
                        row[3].strip(), row[2].strip(), row[4], row[1].strip(), row[0]
                    )
                )
                line_count += 1

    print(f"Processed {line_count} lines.")
    print(f"{len(form_submitted_students)} form submission students collected.")
    return form_submitted_students


def check_registered_against_submitted(registered_students, form_submitted_students):
    matched_registered_students = []
    registered_students_without_submitted_form = []
    for registered_student in registered_students:
        found_submitted_form = False
        for form_submitted_student in form_submitted_students:
            if same_student(registered_student, form_submitted_student):
                matched_registered_students.append(registered_student)
                found_submitted_form = True
                break
        if not found_submitted_form:
            registered_students_without_submitted_form.append(registered_student)
    return (matched_registered_students, registered_students_without_submitted_form)


def write_missing_form_students_to_csv(
    destination_csv_file_path, registered_students_without_submitted_form
):
    with destination_csv_file_path.open(mode="w") as csv_file:
        csv_writer = csv.writer(csv_file, dialect="unix")
        csv_writer.writerow(
            [
                "Class Name",
                "English First Name",
                "English Last Name",
                "Family Email",
                "Family Home Phone",
            ]
        )
        line_count = 1
        for registered_student in registered_students_without_submitted_form:
            csv_writer.writerow(
                [
                    registered_student.class_name,
                    registered_student.first_name,
                    registered_student.last_name,
                    registered_student.family_email,
                    registered_student.family_phone,
                ]
            )
            line_count += 1
    print(f"Written {line_count} lines.")


def main():
    registered_students = read_registered_students_from_csv(pathlib.Path(sys.argv[1]))
    form_submitted_students = read_form_submitted_students_from_csv(
        pathlib.Path(sys.argv[2])
    )
    (
        matched_registered_students,
        registered_students_without_submitted_form,
    ) = check_registered_against_submitted(registered_students, form_submitted_students)
    print(
        f"{len(matched_registered_students)} students have submitted the required form."
    )
    print(
        f"{len(registered_students_without_submitted_form)} students still miss the required form."
    )
    write_missing_form_students_to_csv(
        pathlib.Path(sys.argv[3]), registered_students_without_submitted_form
    )


if __name__ == "__main__":
    main()
