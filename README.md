# twin
Twin is a simple CLI application that finds files that matches a defined pattern and perform actions on them.

## Installation
`npm install -g`

## Usage
- To list all files with names starting with 'Java'
`twin ^Java`
- To rename the matched part (Java) with 'Py'
`twin ^Java --remhd Py`
- To delete all files matching the pattern
`twin ^Java --del`

