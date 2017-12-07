var specialties = ["Anatomical Pathology","Anesthesiology","Cardiac Surgery","Community Medicine","Dermatology","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Pathology","General Surgery","Hematological Pathology","Internal Medicine","Laboratory Medicine","Medical Biochemistry","Medical Genetics","Medical Microbiology","Neurology","Neurology - Pediatric","Neuropathology","Neurosurgery","Nuclear Medicine","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Public Health and Preventive Medicine","Radiation Oncology","Urology","Vascular Surgery"];

var schools = ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Northern Ontario School of Medicine","Queen's University","Universite de Montreal","Universite de Sherbrooke","Universite Laval","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"];
var schoolData = [
	{
		school: "Dalhousie University",
		specialties: ["Anatomical Pathology","Anesthesiology","Cardiac Surgery","Dermatology","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Pathology","General Surgery","Internal Medicine","Laboratory Medicine","Neurology","Neurosurgery","Nuclear Medicine","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Radiation Oncology","Urology"]
	},
	{
		school: "McGill University",
		specialties: ["Anatomical Pathology","Anesthesiology","Cardiac Surgery","Dermatology","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Surgery","Internal Medicine","Medical Biochemistry","Medical Genetics","Neurology","Neurology - Pediatric","Neurosurgery","Nuclear Medicine","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Plastic Surgery","Psychiatry","Public Health and Preventive Medicine","Radiation Oncology","Urology","Vascular Surgery"]
	},
	{
		school: "McMaster University",
		specialties: ["Anatomical Pathology","Anesthesiology","Cardiac Surgery","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Pathology","General Surgery","Internal Medicine","Medical Biochemistry","Medical Microbiology","Neurology","Neurology - Pediatric","Neurosurgery","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Public Health and Preventive Medicine","Radiation Oncology","Urology","Vascular Surgery"]
	},
	{
		school: "Universite de Montreal",
		specialties: ["Anatomical Pathology","Anesthesiology","Cardiac Surgery","Dermatology","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Surgery","Internal Medicine","Medical Biochemistry","Medical Genetics","Medical Microbiology","Neurology","Neurology - Pediatric","Neuropathology","Neurosurgery","Nuclear Medicine","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Public Health and Preventive Medicine","Radiation Oncology","Urology","Vascular Surgery"]
	},
	{
		school: "Universite de Sherbrooke",
		specialties: ["Anatomical Pathology","Anesthesiology","Dermatology","Diagnostic Radiology","Family Medicine","General Surgery","Internal Medicine","Medical Biochemistry","Medical Microbiology","Neurology","Neurosurgery","Nuclear Medicine","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Plastic Surgery","Psychiatry","Public Health and Preventive Medicine","Urology"]
	},
	{
		school: "Universite Laval",
		specialties: ["Anatomical Pathology","Anesthesiology","Cardiac Surgery","Dermatology","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Surgery","Internal Medicine","Medical Biochemistry","Medical Microbiology","Neurology","Neurosurgery","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Public Health and Preventive Medicine","Radiation Oncology","Urology","Vascular Surgery"]
	},
	{
		school: "University of Alberta",
		specialties: ["Anatomical Pathology","Anesthesiology","Cardiac Surgery","Dermatology","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Pathology","General Surgery","Hematological Pathology","Internal Medicine","Medical Microbiology","Neurology","Neurology - Pediatric","Neurosurgery","Nuclear Medicine","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Public Health and Preventive Medicine","Radiation Oncology","Urology"]
	},
	{
		school: "University of British Columbia",
		specialties: ["Anatomical Pathology","Anesthesiology","Cardiac Surgery","Community Medicine","Dermatology","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Pathology","General Surgery","Hematological Pathology","Internal Medicine","Medical Biochemistry","Medical Genetics","Medical Microbiology","Neurology","Neurology - Pediatric","Neuropathology","Neurosurgery","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Public Health and Preventive Medicine","Radiation Oncology","Urology","Vascular Surgery"]
	},
	{
		school: "University of Calgary",
		specialties: ["Anatomical Pathology","Anesthesiology","Cardiac Surgery","Dermatology","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Pathology","General Surgery","Internal Medicine","Medical Genetics","Neurology","Neurology - Pediatric","Neuropathology","Neurosurgery","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Public Health and Preventive Medicine","Radiation Oncology"]
	},
	{
		school: "University of Manitoba",
		specialties: ["Anatomical Pathology","Anesthesiology","Cardiac Surgery","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Surgery","Internal Medicine","Medical Genetics","Medical Microbiology","Neurology","Neurosurgery","Nuclear Medicine","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Public Health and Preventive Medicine","Radiation Oncology","Urology"]
	},
	{
		school: "University of Ottawa",
		specialties: ["Anesthesiology","Cardiac Surgery","Dermatology","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Pathology","General Surgery","Internal Medicine","Laboratory Medicine","Medical Genetics","Neurology","Neurology - Pediatric","Neurosurgery","Nuclear Medicine","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Public Health and Preventive Medicine","Radiation Oncology","Urology","Vascular Surgery"]
	},
	{
		school: "University of Toronto",
		specialties: ["Anesthesiology","Cardiac Surgery","Dermatology","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Surgery","Internal Medicine","Laboratory Medicine","Medical Genetics","Neurology","Neurology - Pediatric","Neurosurgery","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Public Health and Preventive Medicine","Radiation Oncology","Urology","Vascular Surgery"]
	},
	{
		school: "University of Western Ontario",
		specialties: ["Anatomical Pathology","Anesthesiology","Cardiac Surgery","Diagnostic Radiology","Emergency Medicine","Family Medicine","General Surgery","Internal Medicine","Medical Microbiology","Neurology","Neurology - Pediatric","Neurosurgery","Nuclear Medicine","Obstetrics & Gynecology","Ophthalmology","Orthopedic Surgery","Otolaryngology","Pediatrics","Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Radiation Oncology","Urology","Vascular Surgery"]
	}
];
var specialtyData = [
	{
		specialty: "Anatomical Pathology",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Western Ontario"]
	},
	{
		specialty: "Anesthesiology",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Cardiac Surgery",
		schools: ["Dalhousie University","McGill University","McMaster University","Universite Laval","Universite de Montreal","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Community Medicine",
		schools: ["University of British Columbia"]
	},
	{
		specialty: "Dermatology",
		schools: ["Dalhousie University","McGill University","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Ottawa","University of Saskatchewan","University of Toronto"]
	},
	{
		specialty: "Diagnostic Radiology",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Emergency Medicine",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Universite Laval","Universite de Montreal","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Family Medicine",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Northern Ontario School of Medicine","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "General Pathology",
		schools: ["Dalhousie University","McMaster University","University of Alberta","University of British Columbia","University of Calgary","University of Ottawa","University of Saskatchewan"]
	},
	{
		specialty: "General Surgery",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Northern Ontario School of Medicine","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Hematological Pathology",
		schools: ["University of Alberta","University of British Columbia"]
	},
	{
		specialty: "Internal Medicine",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Northern Ontario School of Medicine","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Laboratory Medicine",
		schools: ["Dalhousie University","University of Ottawa","University of Toronto"]
	},
	{
		specialty: "Medical Biochemistry",
		schools: ["McGill University","McMaster University","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of British Columbia"]
	},
	{
		specialty: "Medical Genetics",
		schools: ["McGill University","Universite de Montreal","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Toronto"]
	},
	{
		specialty: "Medical Microbiology",
		schools: ["McMaster University","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Manitoba","University of Western Ontario"]
	},
	{
		specialty: "Neurology",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Neurology - Pediatric",
		schools: ["McGill University","McMaster University","Universite de Montreal","University of Alberta","University of British Columbia","University of Calgary","University of Ottawa","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Neuropathology",
		schools: ["Universite de Montreal","University of British Columbia","University of Calgary"]
	},
	{
		specialty: "Neurosurgery",
		schools: ["Dalhousie University","McGill University","McMaster University","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Nuclear Medicine",
		schools: ["Dalhousie University","McGill University","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Western Ontario"]
	},
	{
		specialty: "Obstetrics & Gynecology",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Ophthalmology",
		schools: ["Dalhousie University","McGill University","McMaster University","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Orthopedic Surgery",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Northern Ontario School of Medicine","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Otolaryngology",
		schools: ["Dalhousie University","McGill University","McMaster University","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Pediatrics",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Northern Ontario School of Medicine","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Physical Medicine & Rehabilitation",
		schools: ["Dalhousie University","McMaster University","Universite Laval","Universite de Montreal","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Plastic Surgery",
		schools: ["Dalhousie University","McGill University","McMaster University","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Psychiatry",
		schools: ["Dalhousie University","McGill University","McMaster University","Memorial University of Newfoundland","Northern Ontario School of Medicine","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Public Health and Preventive Medicine",
		schools: ["McGill University","McMaster University","Northern Ontario School of Medicine","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto"]
	},
	{
		specialty: "Radiation Oncology",
		schools: ["Dalhousie University","McGill University","McMaster University","Universite Laval","Universite de Montreal","University of Alberta","University of British Columbia","University of Calgary","University of Manitoba","University of Ottawa","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Urology",
		schools: ["Dalhousie University","McGill University","McMaster University","Universite Laval","Universite de Montreal","Universite de Sherbrooke","University of Alberta","University of British Columbia","University of Manitoba","University of Ottawa","University of Saskatchewan","University of Toronto","University of Western Ontario"]
	},
	{
		specialty: "Vascular Surgery",
		schools: ["McGill University","McMaster University","Universite Laval","Universite de Montreal","University of British Columbia","University of Ottawa","University of Toronto","University of Western Ontario"]
	}
];
	
	

export {schools, specialties, schoolData, specialtyData};
	
