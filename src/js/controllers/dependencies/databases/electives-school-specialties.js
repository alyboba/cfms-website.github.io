var specialties = ["Anatomical Pathology","Anesthesiology","Cardiac Surgery","Cardiology","Community Medicine","Dermatology","Diagnostic Radiology","Emergency Medicine","Endocrinology","Family Medicine","Gastroenterology","General Pathology","General Surgery","Geriatrics","Hematology","Hematological Pathology","Infectious Disease","Integrated Community Medicine and...","Internal Medicine","International Medicine","Laboratory Medicine","Medical Biochemistry","Medical Genetics","Medical Microbiology","Nephrology","Neurology","Neurology - Pediatric","Neuropathology","Neurosurgery","Nuclear Medicine","Obstetrics & Gynecology","Occupational Medicine","Oncology","Oncology - Pediatric","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitatio...","Plastic Surgery","Psychiatry","Public Health and Preventative Me...","Radiation Oncology","Respirology","Rheumatology","Urology","Vascular Surgery"];

var schools = ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Northern Ontario School of Medicine","Queen's University","Universite de Sherbrooke","Universite Laval","University de Montreal","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"];
var schoolData = [
	{
		school: "Dalhousie University",
		specialties: ["Anatomical Pathology","Cardiac Surgery","Diagnostic Radiology","Emergency Medicine","General Pathology","General Surgery","Internal Medicine","Neurosurgery","Obstetrics & Gynecology","Otolaryngology","Pediatrics","Plastic Surgery","Radiation Oncology"]
	},
	{
		school: "McGill University",
		specialties: ["Anesthesiology","Cardiac Surgery","Dermatology","Emergency Medicine","Family Medicine","General Surgery","Internal Medicine","International Medicine","Neurology","Neurology - Pediatric","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Pediatrics","Psychiatry","Psychiatry Day Hospital"]
	},
	{
		school: "McMaster University",
		specialties: ["Emergency Medicine","Family Medicine","General Surgery","Internal Medicine","Neurology - Pediatric","Obstetrics & Gynecology","Orthopedic Surgery","Otolaryngology","Physical Medicine & Rehabilitation"]
	},
	{
		school: "Memorial University of Newfoundland",
		specialties: ["Anesthesiology","Dermatology","Emergency Medicine","OBSTETRICS GYNECOLOGY","Obstetrics & Gynecology","Orthopedic Surgery","Pediatrics"]
	},
	{
		school: "Northern Ontario School of Medicine",
		specialties: ["Anesthesiology","Inpatient Psychiatry"]
	},
	{
		school: "Queen's University",
		specialties: ["Emergency Medicine","Family Medicine","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery"]
	},
	{
		school: "Universite de Sherbrooke",
		specialties: ["Empty"]
	},
	{
		school: "Universite Laval",
		specialties: ["Empty"]
	},
	{
		school: "University de Montreal",
		specialties: ["Cardiac Surgery","Obstetrics & Gynecology","Plastic Surgery"]
	},
	{
		school: "University of Alberta",
		specialties: ["Anesthesiology","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Pathology","General Surgery","Internal Medicine","Medical Biochemistry","Medical Genetics","Neurology","Neurology - Pediatric","Obstetrics & Gynecology","Oncology - Pediatric","Ophthalmology","Orthopedic Surgery ","Pediatrics","Plastic Surgery","Psychiatry","Radiation Oncology"]
	},
	{
		school: "University of British Columbia",
		specialties: ["Community Medicine","Dermatology","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Surgery","Integrated Community Medicine and Rural Family Practice","Internal Medicine","Neurology - Pediatric","Neurosurgery","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Psychiatry","Radiation Oncology"]
	},
	{
		school: "University of Calgary",
		specialties: ["Anatomical Pathology","Anesthesiology","Community Medicine","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Surgery","Integrated Community Medicine and Rural Family Practice","Internal Medicine","International Medicine","Medical Genetics","Neurology","Neurology - Pediatric","Obstetrics & Gynecology","Orthopedic Surgery","Pediatrics","Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Radiation Oncology","Urology"]
	},
	{
		school: "University of Manitoba",
		specialties: ["Emergency Medicine","Family Medicine","Internal Medicine","Obstetrics & Gynecology","Otolaryngology","Radiation Oncology"]
	},
	{
		school: "University of Ottawa",
		specialties: ["Anesthesiology","Cardiac Surgery","Cardiology (Ward)","Dermatology","Emergency Medicine","Family Medicine","Gen Sx","General Pathology","General Surgery","Integrated Community Medicine and Rural Family Practice","Internal Medicine","International Medicine","Obstetrics & Gynecology","Oncology - Pediatric","Ophthalmology","Orthopedic Surgery","Pediatrics","Physical Medicine & Rehabilitation","Radiation Oncology","Radiology","Thoracic Surgery","Urology"]
	},
	{
		school: "University of Saskatchewan",
		specialties: ["Anesthesiology","Diagnostic Radiology","Neurology","Neurosurgery","Obstetrics & Gynecology"]
	},
	{
		school: "University of Toronto",
		specialties: ["Diagnostic Radiology","Emergency Medicine","Family Medicine","General Surgery","Integrated Community Medicine and Rural Family Practice","Internal Medicine","Neurology","Obstetrics & Gynecology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitation","Psychiatry","Radiation Oncology","Urology"]
	},
	{
		school: "University of Western Ontario",
		specialties: ["Anesthesiology","Cardiac Surgery","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Surgery","Internal Medicine","International Medicine","Obstetrics & Gynecology","Orthopedic Surgery","Otolaryngology","Plastic Surgery"]
	}
];
var specialtyData = [
	{
		specialty: "Anatomical Pathology",
		schools: ["Dalhousie University","University of Calgary"]
	},
	{
		specialty: "Anesthesiology",
		schools: ["McGill University","Memorial University of Newfoundland","Northern Ontario School of Medicine","University of Alberta","University of Calgary","University of Ottawa","University of Saskatchewan","University of Western Ontario"]
	},
	{
		specialty: "Cardiac Surgery",
		schools: ["Dalhousie University","McGill University","University of Ottawa","University of Western Ontario"]
	},
	{
		specialty: "Cardiology",
		schools: ["University of Ottawa"]
	},
	{
		specialty: "Community Medicine",
		schools: ["University of British Columbia","University of Calgary"]
	},
	{
		specialty: "Dermatology",
		schools: ["McGill University","Memorial University of Newfoundland","University of British Columbia","University of Ottawa"]
	},
	{
		specialty: "Diagnostic Radiology",
		schools: ["Dalhousie University","University of Alberta","University of British Columbia","University of Calgary","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Emergency Medicine",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Family Medicine",
		schools: ["McGill University","McMaster University","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "General Pathology",
		schools: ["Dalhousie University","University of Alberta","University of Ottawa"]
	},
	{
		specialty: "General Surgery",
		schools: ["Dalhousie University","McGill University","McMaster University","University of Alberta","University of British Columbia","University of Calgary","University of Ottawa","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Integrated Community Medicine and...",
		schools: ["University of British Columbia","University of Calgary","University of Ottawa","University of Toronto"]
	},
	{
		specialty: "Internal Medicine",
		schools: ["Dalhousie University","McGill University","McMaster University","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "International Medicine",
		schools: ["McGill University","University of Calgary","University of Ottawa","University of Western Ontario"]
	},
	{
		specialty: "Medical Biochemistry",
		schools: ["University of Alberta"]
	},
	{
		specialty: "Medical Genetics",
		schools: ["University of Alberta","University of Calgary"]
	},
	{
		specialty: "Neurology",
		schools: ["McGill University","University of Alberta","University of Calgary","University of Saskatchewan","University of Toronto"]
	},
	{
		specialty: "Neurology - Pediatric",
		schools: ["McGill University","McMaster University","University of Alberta","University of British Columbia","University of Calgary"]
	},
	{
		specialty: "Neurosurgery",
		schools: ["Dalhousie University","University of British Columbia","University of Saskatchewan"]
	},
	{
		specialty: "Obstetrics & Gynecology",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","University of Alberta","University of Calgary","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Oncology - Pediatric",
		schools: ["University of Alberta","University of Ottawa"]
	},
	{
		specialty: "Ophthalmology",
		schools: ["McGill University","University of Alberta","University of British Columbia","University of Ottawa"]
	},
	{
		specialty: "Orthopedic Surgery",
		schools: ["McGill University","McMaster University","Memorial University of Newfoundland","University of Alberta","University of British Columbia","University of Calgary","University of Ottawa","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Otolaryngology",
		schools: ["Dalhousie University","McMaster University","University of British Columbia","University of Manitoba","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Pediatrics",
		schools: ["Dalhousie University","McGill University","Memorial University of Newfoundland","University of Alberta","University of British Columbia","University of Calgary","University of Ottawa","University of Toronto"]
	},
	{
		specialty: "Physical Medicine & Rehabilitatio...",
		schools: ["McMaster University","University of Calgary","University of Ottawa","University of Toronto"]
	},
	{
		specialty: "Plastic Surgery",
		schools: ["Dalhousie University","University of Alberta","University of Calgary","University of Western Ontario"]
	},
	{
		specialty: "Psychiatry",
		schools: ["McGill University","Northern Ontario School of Medicine","University of Alberta","University of British Columbia","University of Calgary","University of Toronto"]
	},
	{
		specialty: "Radiation Oncology",
		schools: ["Dalhousie University","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Toronto"]
	},
	{
		specialty: "Urology",
		schools: ["University of Calgary","University of Ottawa","University of Toronto"]
	}
];

export {specialtyData, specialties, schoolData, schools}