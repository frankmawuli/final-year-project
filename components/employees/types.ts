import type { EmploymentType } from "@/services/employee.service"

export interface Employee {
  id:             number
  empId:          string
  name:           string
  photo:          string | null
  role:           string           // jobTitle
  department:     string
  email:          string
  phone:          string
  location:       string
  joinDate:       string           // display-formatted
  joinDateIso:    string           // YYYY-MM-DD for form input
  bio:            string
  skills:         string[]
  isActive:       boolean
  employmentType: EmploymentType | null
}

export interface FormPayload {
  name:           string
  email:          string
  empId:          string
  role:           string
  employmentType: EmploymentType | ""
  phone:          string
  joinDate:       string           // YYYY-MM-DD
  bio:            string
}
