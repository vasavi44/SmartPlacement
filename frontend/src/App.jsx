import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

/* =========================================================
   AXIOS JWT INTERCEPTOR
========================================================= */

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
   SKILL CATEGORIES
========================================================= */

const skillCategories = {
  Programming: [
    "C",
    "C++",
    "C#",
    "Java",
    "Kotlin",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Python",
    "JavaScript",
    "TypeScript",
    "R",
  ],

  "Web Development": [
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "Express.js",
    "Angular",
    "Vue.js",
    "Next.js",
    "Bootstrap",
    "Tailwind CSS",
    "REST API",
    "GraphQL",
    "JSON",
    "Spring Boot",
  ],

  Databases: [
    "SQL",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Oracle",
    "Redis",
    "SQLite",
    "Firebase",
  ],

  "Cloud & DevOps": [
    "AWS",
    "Microsoft Azure",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "Terraform",
    "CI/CD",
    "Linux",
  ],

  "AI / ML / Data": [
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Natural Language Processing",
    "Computer Vision",
    "Generative AI",
  ],

  "Developer Tools": [
    "Git",
    "GitHub",
    "GitLab",
    "Postman",
    "Maven",
    "Gradle",
    "VS Code",
    "IntelliJ IDEA",
  ],

  Security: [
    "Cybersecurity",
    "Network Security",
    "Ethical Hacking",
    "Cryptography",
    "JWT",
    "OAuth",
    "Spring Security",
  ],

  "Core Computer Science": [
    "Data Structures",
    "Algorithms",
    "Object-Oriented Programming",
    "DBMS",
    "Operating Systems",
    "Computer Networks",
    "System Design",
    "Software Testing",
    "Agile",
    "Scrum",
  ],
};

const API = import.meta.env.VITE_API_URL;

/* =========================================================
   APP
========================================================= */

function App() {
  /* =========================================================
     LOGIN / USER
  ========================================================= */

  const savedUser = localStorage.getItem("user");

  let initialUser = null;

  if (savedUser) {
    try {
      initialUser = JSON.parse(savedUser);
    } catch {
      initialUser = null;
    }
  }

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [user, setUser] = useState(initialUser);
  const [showNotifications, setShowNotifications] =
  useState(false);
  const [page, setPage] = useState(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      return "login";
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        return parsedUser?.role === "RECRUITER"
          ? "recruiter-dashboard"
          : "dashboard";
      } catch {
        return "dashboard";
      }
    }

    return "dashboard";
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [showRegister, setShowRegister] = useState(false);

  /* =========================================================
     STUDENT PROFILE
  ========================================================= */

  const [studentProfile, setStudentProfile] = useState(null);

  const [profileForm, setProfileForm] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    cgpa: "",
    tenthPercentage: "",
    twelfthPercentage: "",
    backlogs: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  /* =========================================================
     JOBS
  ========================================================= */

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [matchingData, setMatchingData] = useState([]);

  /* =========================================================
     SKILLS
  ========================================================= */
  const [studentSkills, setStudentSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");

  const [loadingSkills, setLoadingSkills] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);
  const [removingSkillId, setRemovingSkillId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("All");

  /* =========================================================
     COMPANY / RECRUITER
  ========================================================= */

  const [companyProfile, setCompanyProfile] = useState(null);

  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    industry: "",
    location: "",
    website: "",
    description: "",
  });

  const [savingCompany, setSavingCompany] = useState(false);

  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [recruiterApplicantCount, setRecruiterApplicantCount] =
  useState(0);

const [recruiterShortlistedCount, setRecruiterShortlistedCount] =
  useState(0);

const [recruiterInterviewCount, setRecruiterInterviewCount] =
  useState(0);
  const [selectedRecruiterJob, setSelectedRecruiterJob] =
    useState(null);

  const [jobApplicants, setJobApplicants] = useState([]);

  const [loadingApplicants, setLoadingApplicants] =
    useState(false);

  const [updatingApplicationId, setUpdatingApplicationId] =
    useState(null);

  const [selectedInterviewApplication, setSelectedInterviewApplication] =
    useState(null);

  const [showInterviewForm, setShowInterviewForm] =
    useState(false);

  const [recruiterInterviews, setRecruiterInterviews] =
    useState([]);

  const [loadingRecruiterInterviews, setLoadingRecruiterInterviews] =
    useState(false);

  const [updatingInterviewId, setUpdatingInterviewId] =
    useState(null);

  const [showJobForm, setShowJobForm] = useState(false);

  const [jobForm, setJobForm] = useState({
  jobTitle: "",
  location: "",
  description: "",
  minimumCgpa: "",
  maximumBacklogs: "",
  minimumTenthPercentage: "",
  minimumTwelfthPercentage: "",
  status: "OPEN",
});
const [availableSkills, setAvailableSkills] = useState([]);
const [selectedJobSkills, setSelectedJobSkills] = useState([]);
const [editingJobId, setEditingJobId] = useState(null);
const [skillSearch, setSkillSearch] = useState("");
/* =========================================================
     OTHER STATES
  ========================================================= */

  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [resumeUploaded, setResumeUploaded] = useState(
    localStorage.getItem("resumeUploaded") === "true"
  );

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${API}/auth/login`,
        loginForm
      );

      const loggedUser = response.data;
      console.log("LOGIN RESPONSE:", loggedUser);
console.log(
  "SAVED JWT:",
  loggedUser.token ? "TOKEN RECEIVED" : "NO TOKEN"
);
console.log(
  "LOGGED-IN ROLE:",
  loggedUser.role
);
      setUser(loggedUser);
      setIsLoggedIn(true);

      if (loggedUser.token) {
        localStorage.setItem(
          "token",
          loggedUser.token
        );
      }

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      localStorage.setItem(
        "user",
        JSON.stringify(loggedUser)
      );

      if (loggedUser.email) {
        localStorage.setItem(
          "userEmail",
          loggedUser.email
        );
      }

      if (loggedUser.userId) {
        localStorage.setItem(
          "userId",
          loggedUser.userId
        );
      }

      if (loggedUser.role === "RECRUITER") {
        setPage("recruiter-dashboard");
      } else {
        setPage("dashboard");
      }

      setLoginForm({
        email: "",
        password: "",
      });

      setMessage("Login successful.");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Invalid email or password."
      );
    }
  };

  /* =========================================================
     REGISTER
  ========================================================= */

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      await axios.post(
        `${API}/auth/register`,
        registerForm
      );

      setMessage(
        "Registration successful. Please login."
      );

      setLoginForm({
        email: registerForm.email,
        password: "",
      });

      setRegisterForm({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
      });

      setShowRegister(false);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Registration failed."
      );
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("studentId");
    localStorage.removeItem("resumeUploaded");

    setIsLoggedIn(false);
    setUser(null);
    setStudentProfile(null);
    setStudentSkills([]);
    setMatchingData([]);
    setApplications([]);
    setInterviews([]);
    setReadiness(null);
    setCompanyProfile(null);
    setRecruiterJobs([]);
    setSelectedRecruiterJob(null);
    setJobApplicants([]);
    setRecruiterInterviews([]);
    setShowInterviewForm(false);
    setSelectedInterviewApplication(null);
    setPage("login");
  };

  /* =========================================================
     LOAD STUDENT PROFILE
  ========================================================= */

  const loadStudentProfile = async (email) => {
    if (!email) return;

    try {
      setLoadingProfile(true);

      const response = await axios.get(
        `${API}/students/email/${encodeURIComponent(email)}`
      );

      const profile = response.data;

      setStudentProfile(profile);

      if (profile.id) {
        localStorage.setItem(
          "studentId",
          profile.id
        );
      }

      setProfileForm({
        studentId: profile.studentId || "",
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        cgpa: profile.cgpa ?? "",
        tenthPercentage:
          profile.tenthPercentage ?? "",
        twelfthPercentage:
          profile.twelfthPercentage ?? "",
        backlogs: profile.backlogs ?? "",
      });
    } catch (err) {
      console.error(
        "Profile loading error:",
        err
      );

      if (err.response?.status === 404) {
        setError(
          "Student profile not found."
        );
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (
      isLoggedIn &&
      user?.email &&
      user?.role === "STUDENT"
    ) {
      loadStudentProfile(user.email);
    }
  }, [
    isLoggedIn,
    user?.email,
    user?.role,
  ]);

  /* =========================================================
     LOAD COMPANY PROFILE
  ========================================================= */

  const loadCompanyProfile = async () => {
    if (
      !isLoggedIn ||
      user?.role !== "RECRUITER" ||
      !user?.userId
    ) {
      return;
    }

    try {
      const response = await axios.get(
        `${API}/companies/recruiter/${user.userId}`
      );

      const company = response.data;

      setCompanyProfile(company);

      setCompanyForm({
        companyName:
          company.companyName || "",
        industry:
          company.industry || "",
        location:
          company.location || "",
        website:
          company.website || "",
        description:
          company.description || "",
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setCompanyProfile(null);

        setCompanyForm({
          companyName: "",
          industry: "",
          location: "",
          website: "",
          description: "",
        });
      } else {
        console.error(
          "Company profile loading error:",
          err
        );
      }
    }
  };

  useEffect(() => {
    if (
      isLoggedIn &&
      user?.role === "RECRUITER"
    ) {
      loadCompanyProfile();
    }
  }, [
    isLoggedIn,
    user?.role,
    user?.userId,
  ]);

  /* =========================================================
     SAVE COMPANY PROFILE
  ========================================================= */

  const saveCompanyProfile = async () => {
    if (!user?.userId) {
      setError(
        "Recruiter account not found."
      );
      return;
    }

    const companyName = String(
      companyForm?.companyName || ""
    ).trim();

    if (!companyName) {
      setError(
        "Please enter the company name."
      );
      return;
    }

    try {
      setSavingCompany(true);
      setError("");
      setMessage("");

      let response;

      if (companyProfile?.id) {
        response = await axios.put(
          `${API}/companies/${companyProfile.id}`,
          companyForm
        );
      } else {
        response = await axios.post(
          `${API}/companies/recruiter/${user.userId}`,
          companyForm
        );
      }

      setCompanyProfile(response.data);

      setCompanyForm({
        companyName:
          response.data.companyName || "",
        industry:
          response.data.industry || "",
        location:
          response.data.location || "",
        website:
          response.data.website || "",
        description:
          response.data.description || "",
      });

      setMessage(
        "Company profile saved successfully."
      );
    } catch (err) {
      console.error(
        "Company profile save error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to save company profile."
      );
    } finally {
      setSavingCompany(false);
    }
  };

  /* =========================================================
     LOAD JOBS
  ========================================================= */

  const loadJobs = async () => {
    try {
      const response = await axios.get(
        `${API}/jobs`
      );

      const jobData = response.data || [];

      const formattedJobs =
        jobData.map((job) => ({
          ...job,

          location:
            job.location || "India",

          description:
            job.description ||
            "Explore this placement opportunity and check your eligibility.",

          skills:
            Array.isArray(job.skills)
              ? job.skills
              : "No specific skills listed",
        }));

      setJobs(formattedJobs);
    } catch (err) {
      console.error(
        "Jobs loading error:",
        err
      );
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadJobs();
    }
  }, [isLoggedIn]);

  /* =========================================================
     LOAD RECRUITER JOBS
  ========================================================= */

  const loadRecruiterJobs = async () => {
    try {
      const response = await axios.get(
        `${API}/jobs`
      );

      const allJobs =
        Array.isArray(response.data)
          ? response.data
          : [];

      const companyName =
        companyProfile?.companyName;

      if (!companyName) {
        setRecruiterJobs([]);
        return;
      }

      const myJobs =
        allJobs.filter(
          (job) =>
            String(
              job.companyName || ""
            )
              .trim()
              .toLowerCase() ===
            String(companyName)
              .trim()
              .toLowerCase()
        );

      setRecruiterJobs(myJobs);
    } catch (err) {
      console.error(
        "Recruiter jobs loading error:",
        err
      );
    }
  };
   const loadRecruiterStats = async () => {
  if (!recruiterJobs.length) {
    setRecruiterApplicantCount(0);
    setRecruiterShortlistedCount(0);
    setRecruiterInterviewCount(0);
    return;
  }

  try {
    let allApplicants = [];

    for (const job of recruiterJobs) {
      const response = await axios.get(
        `${API}/applications/job/${job.id}`
      );

      if (Array.isArray(response.data)) {
        allApplicants = [
          ...allApplicants,
          ...response.data,
        ];
      }
    }

    setRecruiterApplicantCount(
      allApplicants.length
    );

    setRecruiterShortlistedCount(
      allApplicants.filter(
        (application) =>
          application.status === "SHORTLISTED"
      ).length
    );

    // Interview count will be loaded from the
    // recruiter interview endpoint instead of
    // requesting a non-existent application endpoint.
    try {
      const interviewResponse = await axios.get(
        `${API}/interviews`
      );

      const allInterviews =
        Array.isArray(interviewResponse.data)
          ? interviewResponse.data
          : [];

      const companyName =
        companyProfile?.companyName;

      const myInterviews =
        allInterviews.filter((interview) => {
          const interviewCompany =
            interview.application?.job?.companyName;

          return (
            String(interviewCompany || "")
              .trim()
              .toLowerCase() ===
            String(companyName || "")
              .trim()
              .toLowerCase()
          );
        });

      setRecruiterInterviewCount(
        myInterviews.length
      );
    } catch (interviewError) {
      console.error(
        "Recruiter interview count loading error:",
        interviewError
      );

      setRecruiterInterviewCount(0);
    }
  } catch (err) {
    console.error(
      "Recruiter statistics loading error:",
      err
    );
  }
};
  useEffect(() => {
  if (
    isLoggedIn &&
    user?.role === "RECRUITER" &&
    companyProfile?.companyName
  ) {
    loadRecruiterJobs();
  }
}, [
  isLoggedIn,
  user?.role,
  companyProfile?.companyName,
]);

useEffect(() => {
  if (
    isLoggedIn &&
    user?.role === "RECRUITER" &&
    recruiterJobs.length > 0
  ) {
    loadRecruiterStats();
  }
}, [
  isLoggedIn,
  user?.role,
  recruiterJobs,
]);

  /* =========================================================
     LOAD APPLICANTS
  ========================================================= */

  const loadJobApplicants = async (job) => {
    if (!job?.id) {
      return;
    }

    try {
      setLoadingApplicants(true);
      setError("");
      setMessage("");

      const response = await axios.get(
        `${API}/applications/job/${job.id}`
      );

      setSelectedRecruiterJob(job);

      setJobApplicants(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Applicants loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to load applicants."
      );

      setJobApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  /* =========================================================
     UPDATE APPLICATION STATUS
  ========================================================= */

  const updateApplicantStatus = async (
    applicationId,
    status
  ) => {
    if (!applicationId) {
      return;
    }

    try {
      setUpdatingApplicationId(
        applicationId
      );

      setError("");
      setMessage("");

      await axios.put(
        `${API}/applications/${applicationId}/status`,
        null,
        {
          params: {
            status,
          },
        }
      );

      setJobApplicants(
        (previous) =>
          previous.map(
            (application) =>
              application.id ===
              applicationId
                ? {
                    ...application,
                    status,
                  }
                : application
          )
      );

      setMessage(
        `Application status updated to ${status}.`
      );
    } catch (err) {
      console.error(
        "Application status update error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to update application status."
      );
    } finally {
      setUpdatingApplicationId(
        null
      );
    }
  };

  /* =========================================================
     SCHEDULE INTERVIEW
  ========================================================= */

  const scheduleInterview = async ({
    applicationId,
    date,
    time,
    mode,
    location,
  }) => {
    if (
      !applicationId ||
      !date ||
      !time ||
      !mode ||
      !location
    ) {
      setError(
        "Please fill all interview details."
      );
      return;
    }

    try {
      setError("");
      setMessage("");

      await axios.post(
        `${API}/interviews/application/${applicationId}`,
        null,
        {
          params: {
            date,
            time,
            mode,
            location,
          },
        }
      );

      setMessage(
        "Interview scheduled successfully."
      );

      setShowInterviewForm(false);
      setSelectedInterviewApplication(null);

      await loadRecruiterInterviews();
    } catch (err) {
      console.error(
        "Interview scheduling error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to schedule interview."
      );
    }
  };

  /* =========================================================
     LOAD RECRUITER INTERVIEWS
  ========================================================= */

  const loadRecruiterInterviews = async () => {
    try {
      setLoadingRecruiterInterviews(true);

      const response = await axios.get(
        `${API}/interviews`
      );

      const allInterviews = Array.isArray(
        response.data
      )
        ? response.data
        : [];

      const companyName =
        companyProfile?.companyName;

      if (!companyName) {
        setRecruiterInterviews([]);
        return;
      }

      const myInterviews =
        allInterviews.filter((interview) => {
          const interviewCompany =
            interview.application
              ?.job
              ?.companyName;

          return (
            String(interviewCompany || "")
              .trim()
              .toLowerCase() ===
            String(companyName)
              .trim()
              .toLowerCase()
          );
        });

      setRecruiterInterviews(
        myInterviews
      );
    } catch (err) {
      console.error(
        "Recruiter interviews loading error:",
        err
      );

      setRecruiterInterviews([]);
    } finally {
      setLoadingRecruiterInterviews(false);
    }
  };

  useEffect(() => {
    if (
      isLoggedIn &&
      user?.role === "RECRUITER" &&
      companyProfile?.companyName
    ) {
      loadRecruiterInterviews();
    }
  }, [
    isLoggedIn,
    user?.role,
    companyProfile?.companyName,
  ]);

  /* =========================================================
     SAVE RECRUITER JOB
  ========================================================= */
  const editRecruiterJob = async (job) => {
  try {
    setError("");
    setMessage("");

    // Load the selected job's skills
    const response = await axios.get(
      `${API}/job-skills/job/${job.id}`
    );

    const jobSkills = response.data || [];

    setSelectedJobSkills(
      jobSkills
        .map((jobSkill) => jobSkill.skill?.id)
        .filter((id) => id !== undefined && id !== null)
    );

    // Load job data into the existing form
    setJobForm({
      jobTitle: job.jobTitle || "",
      location: job.location || "",
      description: job.description || "",
      minimumCgpa: job.minimumCgpa ?? "",
      maximumBacklogs: job.maximumBacklogs ?? "",
      minimumTenthPercentage: job.minimumTenthPercentage ?? "",
      minimumTwelfthPercentage: job.minimumTwelfthPercentage ?? "",
      status: job.status || "OPEN",
    });

    setEditingJobId(job.id);
    setSkillSearch("");
    setShowJobForm(true);

    // Scroll to the form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  } catch (err) {
    console.error("Unable to load job for editing:", err);

    const responseData = err.response?.data;

    const serverMessage =
      typeof responseData === "string"
        ? responseData
        : responseData?.message;

    setError(
      serverMessage || "Unable to load job for editing."
    );
  }
};
const toggleJobStatus = async (job) => {
  try {
    setError("");
    setMessage("");

    const newStatus =
      job.status === "CLOSED"
        ? "OPEN"
        : "CLOSED";

    await axios.put(
      `${API}/jobs/${job.id}/status`,
      newStatus,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setMessage(
      newStatus === "CLOSED"
        ? "Job closed successfully."
        : "Job reopened successfully."
    );

    await loadRecruiterJobs();
    await loadJobs();
  } catch (err) {
    console.error("Unable to update job status:", err);

    const responseData = err.response?.data;

    const serverMessage =
      typeof responseData === "string"
        ? responseData
        : responseData?.message;

    setError(
      serverMessage || "Unable to update job status."
    );
  }
};
const deleteRecruiterJob = async (jobId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this job?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setError("");
    setMessage("");

    await axios.delete(`${API}/jobs/${jobId}`);

    setMessage("Job deleted successfully.");

    await loadRecruiterJobs();
    await loadJobs();
  } catch (err) {
    console.error("Unable to delete job:", err);

    const responseData = err.response?.data;

    const serverMessage =
      typeof responseData === "string"
        ? responseData
        : responseData?.message;

    setError(
      serverMessage ||
        "Unable to delete this job. It may have existing applications."
    );
  }
};
  const saveRecruiterJob = async () => {
  if (!companyProfile?.companyName) {
    setError("Please complete your company profile first.");
    return;
  }

  if (!jobForm.jobTitle.trim()) {
    setError("Please enter a job title.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const jobData = {
      companyName: companyProfile.companyName,
      jobTitle: jobForm.jobTitle,
      location: jobForm.location,
      description: jobForm.description,
      minimumCgpa: Number(jobForm.minimumCgpa),
      maximumBacklogs: Number(jobForm.maximumBacklogs),
      minimumTenthPercentage: Number(jobForm.minimumTenthPercentage),
      minimumTwelfthPercentage: Number(jobForm.minimumTwelfthPercentage),
      status: editingJobId ? jobForm.status || "OPEN" : "OPEN",
    };

    let jobId;

    if (editingJobId) {
      // EDIT EXISTING JOB
      const response = await axios.put(
        `${API}/jobs/${editingJobId}`,
        jobData
      );

      jobId = response.data.id;

      // Get existing skills
      const existingSkillsResponse = await axios.get(
        `${API}/job-skills/job/${editingJobId}`
      );

      const existingSkills = existingSkillsResponse.data || [];

      // Remove old skills
      await Promise.all(
        existingSkills.map((jobSkill) =>
          axios.delete(
            `${API}/job-skills/job/${editingJobId}/skill/${jobSkill.skill.id}`
          )
        )
      );

      // Add newly selected skills
      if (selectedJobSkills.length > 0) {
        await Promise.all(
          selectedJobSkills.map((skillId) =>
            axios.post(
              `${API}/job-skills/job/${editingJobId}/skill/${skillId}?weight=1.0`
            )
          )
        );
      }

      setMessage("Job updated successfully.");
    } else {
      // CREATE NEW JOB
      const response = await axios.post(`${API}/jobs`, jobData);

      jobId = response.data.id;

      // Add selected skills
      if (selectedJobSkills.length > 0) {
        await Promise.all(
          selectedJobSkills.map((skillId) =>
            axios.post(
              `${API}/job-skills/job/${jobId}/skill/${skillId}?weight=1.0`
            )
          )
        );

      }

      setMessage("Job posted successfully.");
    }

    // Reset form
    setJobForm({
      jobTitle: "",
      location: "",
      description: "",
      minimumCgpa: "",
      maximumBacklogs: "",
      minimumTenthPercentage: "",
      minimumTwelfthPercentage: "",
      status: "OPEN",
    });

    setSelectedJobSkills([]);
    setSkillSearch("");
    setEditingJobId(null);
    setShowJobForm(false);

    await loadRecruiterJobs();
    await loadJobs();

  } catch (err) {
    console.error("Job save error:", err);

    const responseData = err.response?.data;

    const serverMessage =
      typeof responseData === "string"
        ? responseData
        : responseData?.message;

    setError(serverMessage || "Unable to save job.");
  } finally {
    setLoading(false);
  }
};

            

  /* =========================================================
     LOAD ALL AVAILABLE SKILLS
  ========================================================= */

  const loadSkills = async () => {
    try {
      setLoadingSkills(true);
      setError("");

      const response = await axios.get(
        `${API}/skills`
      );

      let databaseSkills =
        response.data || [];

      const allSkills = [
        ...new Set(
          Object.values(skillCategories)
            .flat()
            .map((skill) => skill.trim())
        ),
      ];

      const existingSkillNames =
        new Set(
          databaseSkills
            .map((skill) =>
              skill.name
                ?.trim()
                .toLowerCase()
            )
            .filter(Boolean)
        );

      const missingSkills =
        allSkills.filter(
          (skillName) =>
            !existingSkillNames.has(
              skillName.toLowerCase()
            )
        );

      for (const skillName of missingSkills) {
        try {
          await axios.post(
            `${API}/skills`,
            {
              name: skillName,
            }
          );
        } catch (skillError) {
          console.warn(
            `Could not add skill: ${skillName}`,
            skillError.response?.data ||
              skillError.message
          );
        }
      }

      const refreshedResponse =
        await axios.get(
          `${API}/skills`
        );

      databaseSkills =
        refreshedResponse.data || [];

      setAvailableSkills(
        databaseSkills
      );
    } catch (err) {
      console.error(
        "Skills loading error:",
        err
      );

      setAvailableSkills([]);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to load technical skills."
      );
    } finally {
      setLoadingSkills(false);
    }
  };

  useEffect(() => {
  if (
    isLoggedIn &&
    (user?.role === "STUDENT" ||
      user?.role === "RECRUITER")
  ) {
    loadSkills();
  }
}, [
  isLoggedIn,
  user?.role,
]);

  /* =========================================================
     LOAD STUDENT SKILLS
  ========================================================= */

  const loadStudentSkills = async () => {
    const studentId =
      studentProfile?.id ||
      localStorage.getItem(
        "studentId"
      );

    if (!studentId) return;

    try {
      setLoadingSkills(true);

      const response = await axios.get(
        `${API}/student-skills/student/${studentId}`
      );

      setStudentSkills(
        response.data || []
      );
    } catch (err) {
      console.error(
        "Student skills loading error:",
        err
      );
    } finally {
      setLoadingSkills(false);
    }
  };

  useEffect(() => {
    if (
      user?.role === "STUDENT" &&
      studentProfile?.id
    ) {
      loadStudentSkills();
    }
  }, [
    studentProfile?.id,
    user?.role,
  ]);

  /* =========================================================
     ADD SKILL
  ========================================================= */

  const addSkillToStudent = async (
    skillId = selectedSkillId
  ) => {
    const studentId =
      studentProfile?.id ||
      localStorage.getItem(
        "studentId"
      );

    if (!studentId || !skillId) {
      setError(
        "Please select a skill first."
      );
      return;
    }

    const alreadyAdded =
      studentSkills.some(
        (studentSkill) =>
          String(
            studentSkill.skill?.id
          ) === String(skillId)
      );

    if (alreadyAdded) {
      setError(
        "This skill is already added to your profile."
      );
      return;
    }

    try {
      setAddingSkill(true);
      setError("");
      setMessage("");

      await axios.post(
        `${API}/student-skills/student/${studentId}/skill/${skillId}`
      );

      await loadStudentSkills();

      setSelectedSkillId("");

      setMessage(
        "Skill added successfully."
      );

      await loadMatchingData();
    } catch (err) {
      console.error(
        "Adding skill error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to add skill."
      );
    } finally {
      setAddingSkill(false);
    }
  };

  /* =========================================================
     REMOVE SKILL
  ========================================================= */

  const removeSkillFromStudent =
    async (skillId) => {
      const studentId =
        studentProfile?.id ||
        localStorage.getItem(
          "studentId"
        );

      if (!studentId || !skillId) {
        return;
      }

      try {
        setRemovingSkillId(skillId);
        setError("");
        setMessage("");

        await axios.delete(
          `${API}/student-skills/student/${studentId}/skill/${skillId}`
        );

        await loadStudentSkills();

        setMessage(
          "Skill removed successfully."
        );

        await loadMatchingData();
      } catch (err) {
        console.error(
          "Removing skill error:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Unable to remove skill."
        );
      } finally {
        setRemovingSkillId(null);
      }
    };

  /* =========================================================
     FILTER SKILLS
  ========================================================= */

  const addedSkillIds =
    studentSkills.map(
      (studentSkill) =>
        String(
          studentSkill.skill?.id
        )
    );

  const selectedCategorySkills =
    selectedCategory === "All"
      ? Object.values(
          skillCategories
        ).flat()
      : skillCategories[
          selectedCategory
        ] || [];

  const filteredSkills =
    availableSkills.filter(
      (skill) => {
        const matchesSearch =
          skill.name
            ?.toLowerCase()
            .includes(
              skillSearch
                .toLowerCase()
                .trim()
            );

        const matchesCategory =
          selectedCategorySkills.some(
            (categorySkill) =>
              categorySkill
                .toLowerCase() ===
              skill.name?.toLowerCase()
          );

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

  const skillsToAdd =
    filteredSkills.filter(
      (skill) =>
        !addedSkillIds.includes(
          String(skill.id)
        )
    );

  /* =========================================================
     LOAD MATCHING DATA
  ========================================================= */

  const loadMatchingData =
    async () => {
      const studentId =
        studentProfile?.id ||
        localStorage.getItem(
          "studentId"
        );

      if (
        !studentId ||
        jobs.length === 0
      ) {
        return;
      }

      try {
        const results =
          await Promise.all(
            jobs.map(
              async (job) => {
                try {
                  const response =
                    await axios.get(
                      `${API}/matching/student/${studentId}/job/${job.id}`
                    );

                  return response.data;
                } catch (err) {
                  console.error(
                    `Matching failed for job ${job.id}:`,
                    err
                  );

                  return null;
                }
              }
            )
          );

        setMatchingData(
          results.filter(
            (item) => item !== null
          )
        );
      } catch (err) {
        console.error(
          "Matching data error:",
          err
        );
      }
    };

  useEffect(() => {
    if (
      user?.role === "STUDENT" &&
      studentProfile?.id &&
      jobs.length > 0
    ) {
      loadMatchingData();
    }
  }, [
    studentProfile?.id,
    jobs,
    user?.role,
  ]);

  /* =========================================================
     GET MATCH PERCENTAGE
  ========================================================= */

  const getJobMatchPercentage = (
    jobId
  ) => {
    const match =
      matchingData.find(
        (item) =>
          String(item.jobId) ===
          String(jobId)
      );

    return Math.round(
      match?.overallMatchPercentage ||
        0
    );
  };

  /* =========================================================
     LOAD APPLICATIONS
  ========================================================= */

  const loadApplications =
    async () => {
      const studentId =
        studentProfile?.id ||
        localStorage.getItem(
          "studentId"
        );

      if (!studentId) return;

      try {
        const response =
          await axios.get(
            `${API}/applications/student/${studentId}`
          );

        setApplications(
          response.data || []
        );
      } catch (err) {
        console.error(
          "Applications loading error:",
          err
        );
      }
    };

  useEffect(() => {
    if (
      user?.role === "STUDENT" &&
      studentProfile?.id
    ) {
      loadApplications();
    }
  }, [
    studentProfile?.id,
    user?.role,
  ]);

  /* =========================================================
     LOAD INTERVIEWS
  ========================================================= */

  const loadInterviews =
    async () => {
      const studentId =
        studentProfile?.id ||
        localStorage.getItem(
          "studentId"
        );

      if (!studentId) return;

      try {
        const response =
          await axios.get(
            `${API}/interviews/student/${studentId}`
          );

        setInterviews(
          response.data || []
        );
      } catch (err) {
        console.error(
          "Interviews loading error:",
          err
        );
      }
    };

  useEffect(() => {
    if (
      user?.role === "STUDENT" &&
      studentProfile?.id
    ) {
      loadInterviews();
    }
  }, [
    studentProfile?.id,
    user?.role,
  ]);

  /* =========================================================
     LOAD READINESS
  ========================================================= */

  const loadReadiness =
    async () => {
      const studentId =
        studentProfile?.id ||
        localStorage.getItem(
          "studentId"
        );

      if (!studentId) return;

      try {
        const response =
          await axios.get(
            `${API}/placement-readiness/student/${studentId}`
          );

        setReadiness(
          response.data
        );
      } catch {
        console.log(
          "Readiness not available yet."
        );
      }
    };

  useEffect(() => {
    if (
      user?.role === "STUDENT" &&
      studentProfile?.id
    ) {
      loadReadiness();
    }
  }, [
    studentProfile?.id,
    user?.role,
  ]);

  /* =========================================================
     PROFILE INPUT
  ========================================================= */

  const handleProfileChange = (
    field,
    value
  ) => {
    setProfileForm(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const saveProfile = async (e) => {
    e.preventDefault();

    if (!studentProfile?.id) {
      setError(
        "Student profile ID not found."
      );
      return;
    }

    setSavingProfile(true);
    setError("");
    setMessage("");

    try {
      const updatedStudent = {
        studentId:
          profileForm.studentId,

        name:
          profileForm.name,

        email:
          profileForm.email,

        phone:
          profileForm.phone,

        cgpa:
          profileForm.cgpa === ""
            ? 0
            : Number(
                profileForm.cgpa
              ),

        tenthPercentage:
          profileForm.tenthPercentage === ""
            ? 0
            : Number(
                profileForm.tenthPercentage
              ),

        twelfthPercentage:
          profileForm.twelfthPercentage === ""
            ? 0
            : Number(
                profileForm.twelfthPercentage
              ),

        backlogs:
          profileForm.backlogs === ""
            ? 0
            : Number(
                profileForm.backlogs
              ),
      };

      const response =
        await axios.put(
          `${API}/students/${studentProfile.id}`,
          updatedStudent
        );

      setStudentProfile(
        response.data
      );

      setProfileForm({
        studentId:
          response.data.studentId || "",

        name:
          response.data.name || "",

        email:
          response.data.email || "",

        phone:
          response.data.phone || "",

        cgpa:
          response.data.cgpa ?? "",

        tenthPercentage:
          response.data.tenthPercentage ?? "",

        twelfthPercentage:
          response.data.twelfthPercentage ?? "",

        backlogs:
          response.data.backlogs ?? "",
      });

      setMessage(
        "Profile saved successfully."
      );

      setIsEditingProfile(false);

      await loadMatchingData();
      await loadReadiness();
    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  /* =========================================================
     RESUME UPLOAD
  ========================================================= */

  const handleResumeUpload =
    async (e) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      const studentId =
        studentProfile?.id ||
        localStorage.getItem(
          "studentId"
        );

      if (!studentId) {
        setError(
          "Student profile not found."
        );
        return;
      }
      const handleViewResume = async () => {
    const studentId =
      studentProfile?.id ||
      localStorage.getItem("studentId");

    if (!studentId) {
      setError("Student profile not found.");
      return;
    }

    try {
      const response = await axios.get(
        `${API}/resumes/student/${studentId}`,
        {
          responseType: "blob",
        }
      );

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], {
          type:
            response.headers["content-type"] ||
            "application/pdf",
        })
      );

      window.open(fileURL, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(fileURL);
      }, 60000);

    } catch (err) {
      console.error("Resume view error:", err);
      setError("Unable to open your resume.");
    }
  };
      const formData =
        new FormData();

      formData.append(
        "resume",
        file
      );

      try {
        const response =
          await axios.post(
            `${API}/resumes/student/${studentId}`,
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setResumeUploaded(true);

        localStorage.setItem(
          "resumeUploaded",
          "true"
        );

        setMessage(
          response.data ||
            "Resume uploaded successfully."
        );
      } catch (err) {
        console.error(
          "Resume upload error:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Resume upload failed."
        );
      }
    };
/* =========================================================
   APPLY FOR JOB
========================================================= */

const openApplyModal = (job) => {
  setSelectedJob(job);
  setShowApplyModal(true);
};

const applyForJob = async () => {
  const studentId =
    studentProfile?.id ||
    localStorage.getItem("studentId");

  if (!studentId || !selectedJob?.id) {
    setMessage("");
    setError("Student or job information is missing.");
    return;
  }

  try {
    setError("");
    setMessage("");

    await axios.post(
      `${API}/applications/student/${studentId}/job/${selectedJob.id}`
    );

    setError("");
    setMessage("Application submitted successfully.");

    setShowApplyModal(false);
    setSelectedJob(null);

    await loadApplications();
    await loadReadiness();

  } catch (err) {
    console.error("Application error:", err);

    setMessage("");

    if (err.response?.status === 409) {
      setError("You have already applied for this job.");
    } else {
      const responseData = err.response?.data;

      const serverMessage =
        typeof responseData === "string"
          ? responseData
          : responseData?.message;

      setError(
        serverMessage || "Unable to apply for this job."
      );
    }
  }
};
  /* =========================================================

   LOGIN SCREEN
  ========================================================= */

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">

          <div className="login-logo">

            <div className="logo-icon">
              S
            </div>

            <h1>
              SmartPlacement
            </h1>

            <p>
              Intelligent Placement
              Management System
            </p>

          </div>

          {!showRegister ? (
            <>

              <h2>
                Welcome Back
              </h2>

              <p className="login-subtitle">
                Login to your placement portal
              </p>

              {message && (
                <div className="success-message">
                  {message}
                </div>
              )}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleLogin}
              >

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={
                    loginForm.email
                  }
                  onChange={(e) =>
                    setLoginForm(
                      (previous) => ({
                        ...previous,
                        email:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="Enter your email"
                  required
                />

                <label>
                  Password
                </label>

                <input
                  type="password"
                  value={
                    loginForm.password
                  }
                  onChange={(e) =>
                    setLoginForm(
                      (previous) => ({
                        ...previous,
                        password:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="submit"
                  className="primary-button"
                >
                  Login
                </button>

              </form>

              <p className="switch-auth">
                Don't have an account?

                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(
                      true
                    );
                    setError("");
                    setMessage("");
                  }}
                >
                  Register
                </button>

              </p>

            </>
          ) : (
            <>

              <h2>
                Create Account
              </h2>

              <p className="login-subtitle">
                Register as a student or recruiter
              </p>

              {message && (
                <div className="success-message">
                  {message}
                </div>
              )}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form
                onSubmit={
                  handleRegister
                }
              >

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  value={
                    registerForm.name
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      (previous) => ({
                        ...previous,
                        name:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="Enter your name"
                  required
                />

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={
                    registerForm.email
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      (previous) => ({
                        ...previous,
                        email:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="Enter your email"
                  required
                />

                <label>
                  Password
                </label>

                <input
                  type="password"
                  value={
                    registerForm.password
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      (previous) => ({
                        ...previous,
                        password:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="Create password"
                  required
                />

                <label>
                  Account Type
                </label>

                <select
                  value={
                    registerForm.role
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      (previous) => ({
                        ...previous,
                        role:
                          e.target.value,
                      })
                    )
                  }
                >

                  <option value="STUDENT">
                    Student
                  </option>

                  <option value="RECRUITER">
                    Recruiter
                  </option>

                </select>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Register
                </button>

              </form>

              <p className="switch-auth">
                Already have an account?

                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(
                      false
                    );
                    setError("");
                    setMessage("");
                  }}
                >
                  Login
                </button>

              </p>

            </>
          )}

        </div>
      </div>
    );
  }

  /* =========================================================
     USER DISPLAY
  ========================================================= */

  const firstName =
    user?.name?.split(" ")[0] ||
    studentProfile?.name?.split(" ")[0] ||
    "User";

  /* =========================================================
     MAIN APPLICATION
  ========================================================= */

  return (
    <div className="app-container">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            S
          </div>

          <div>

            <h2>
              SmartPlacement
            </h2>

            <span>
              Career Portal
            </span>

          </div>

        </div>

        {user?.role === "RECRUITER" ? (

          <nav className="sidebar-nav">

            <button
              className={
                page ===
                "recruiter-dashboard"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage(
                  "recruiter-dashboard"
                )
              }
            >
              <span>⌂</span>
              <span>
                Dashboard
              </span>
            </button>

            <button
              className={
                page ===
                "company-profile"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage(
                  "company-profile"
                )
              }
            >
              <span>🏢</span>
              <span>
                Company Profile
              </span>
            </button>

            <button
              className={
                page === "recruiter-jobs"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage(
                  "recruiter-jobs"
                )
              }
            >
              <span>💼</span>
              <span>
                Manage Jobs
              </span>
            </button>

            <button
              className={
                page === "recruiter-interviews"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage(
                  "recruiter-interviews"
                )
              }
            >
              <span>📅</span>
              <span>
                Interviews
              </span>
            </button>

            <button
              className={
                page === "recruiter-applicants"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setPage(
                  "recruiter-applicants"
                );
                setSelectedRecruiterJob(null);
                setJobApplicants([]);
              }}
            >
              <span>👥</span>
              <span>
                Applicants
              </span>
            </button>

          </nav>

        ) : (

          <nav className="sidebar-nav">

            <button
              className={
                page === "dashboard"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage("dashboard")
              }
            >
              <span>⌂</span>
              <span>
                Dashboard
              </span>
            </button>

            <button
              className={
                page === "profile"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage("profile")
              }
            >
              <span>👤</span>
              <span>
                My Profile
              </span>
            </button>

            <button
              className={
                page === "jobs"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage("jobs")
              }
            >
              <span>💼</span>
              <span>
                Job Opportunities
              </span>
            </button>

            <button
              className={
                page === "matching"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage("matching")
              }
            >
              <span>📊</span>
              <span>
                Job Matching
              </span>
            </button>

            <button
              className={
                page === "applications"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage("applications")
              }
            >
              <span>📄</span>
              <span>
                My Applications
              </span>
            </button>

            <button
              className={
                page === "interviews"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage("interviews")
              }
            >
              <span>📅</span>
              <span>
                Interviews
              </span>
            </button>

            <button
              className={
                page === "readiness"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage("readiness")
              }
            >
              <span>🎯</span>
              <span>
                Placement Readiness
              </span>
            </button>

          </nav>

        )}

        <button
          className="logout-button"
          onClick={logout}
        >
          → Logout
        </button>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="main-content">

        <header className="topbar">

          <div></div>

          <div className="topbar-user">

  <div className="notification-wrapper">

    <button
      className="notification-button"
      onClick={() =>
        setShowNotifications(
          !showNotifications
        )
      }
      title="Notifications"
    >
      🔔
    </button>

    {showNotifications && (
      <div className="notification-dropdown">

        <div className="notification-header">
          <strong>Notifications</strong>

          <button
            className="notification-close"
            onClick={() =>
              setShowNotifications(false)
            }
          >
            ×
          </button>
        </div>

        <div className="notification-list">

          {user?.role === "STUDENT" ? (
            <>
              <div className="notification-item">
                <div className="notification-icon">
                  📄
                </div>

                <div>
                  <strong>
                    Placement Updates
                  </strong>

                  <p>
                    Check your latest application
                    and interview updates.
                  </p>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-icon">
                  💼
                </div>

                <div>
                  <strong>
                    New Opportunities
                  </strong>

                  <p>
                    New jobs may be available based
                    on your profile.
                  </p>
                </div>
              </div>
            </>
          ) : user?.role === "RECRUITER" ? (
            <>
              <div className="notification-item">
                <div className="notification-icon">
                  👥
                </div>

                <div>
                  <strong>
                    Applicant Updates
                  </strong>

                  <p>
                    Check your latest applicants and
                    application activity.
                  </p>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-icon">
                  📅
                </div>

                <div>
                  <strong>
                    Interview Updates
                  </strong>

                  <p>
                    Check your scheduled interviews
                    and upcoming activities.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="notification-empty">
              <div>🔔</div>
              <p>No new notifications</p>
            </div>
          )}

        </div>
      </div>
    )}

  </div>

  <div className="avatar">
    {firstName
      .charAt(0)
      .toUpperCase()}
  </div>

            <div className="user-details">

              <strong>
                {user?.name ||
                  "User"}
              </strong>

              <span>
                {user?.role ||
                  "USER"}
              </span>

            </div>

          </div>

        </header>

        <section className="content-area">

          {message && (
            <div className="success-message global-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message global-message">
              {error}
            </div>
          )}

          {/* =================================================
              STUDENT DASHBOARD
          ================================================= */}

          {page === "dashboard" &&
            user?.role === "STUDENT" && (

            <div className="dashboard-page">

              <div className="page-heading">

                <div>

                  <h1>
                    Welcome back,{" "}
                    {firstName}! 👋
                  </h1>

                  <p>
                    Here's your placement
                    journey at a glance.
                  </p>

                </div>

              </div>

              <div className="stats-grid">

                <div className="stat-card">

                  <div className="stat-icon">
                    💼
                  </div>

                  <div>

                    <h3>
                      {jobs.length}
                    </h3>

                    <p>
                      Available Jobs
                    </p>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    📄
                  </div>

                  <div>

                    <h3>
                      {applications.length}
                    </h3>

                    <p>
                      Applications
                    </p>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    📅
                  </div>

                  <div>

                    <h3>
                      {interviews.length}
                    </h3>

                    <p>
                      Interviews
                    </p>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    🎯
                  </div>

                  <div>

                    <h3>
                      {readiness?.overallScore != null
  ? `${Math.round(readiness.overallScore)}%`
  : "N/A"}
                    </h3>

                    <p>
                      Readiness Score
                    </p>

                  </div>

                </div>

              </div>

              <div className="dashboard-grid">

                <div className="dashboard-card">

                  <div className="card-header">

                    <h2>
                      Recommended Jobs
                    </h2>

                    <button
                      onClick={() =>
                        setPage("jobs")
                      }
                    >
                      View All
                    </button>

                  </div>

                  {jobs
                    .slice(0, 4)
                    .map((job) => (

                      <div
                        className="job-mini-card"
                        key={job.id}
                      >

                        <div>

                          <h3>
                            {job.jobTitle}
                          </h3>

                          <p>
                            {job.companyName}
                          </p>

                        </div>

                        <span className="match-badge">
                          {getJobMatchPercentage(
                            job.id
                          )}
                          % Match
                        </span>

                      </div>

                    ))}

                  {jobs.length === 0 && (
                    <p>
                      No jobs available yet.
                    </p>
                  )}

                </div>

                <div className="dashboard-card">

                  <div className="card-header">

                    <h2>
                      Profile Completion
                    </h2>

                  </div>

                  <div className="profile-progress">

                    <div className="progress-circle">

                      <strong>
                        {studentProfile?.profileCompletionPercentage != null
                          ? `${Math.round(studentProfile.profileCompletionPercentage)}%`
                          : "N/A"}
                      </strong>

                    </div>

                    <div>

                      <h3>
                        Complete your profile
                      </h3>

                      <p>
                        Add your academic
                        details and skills
                        to improve your
                        job matches.
                      </p>

                      <button
                        onClick={() =>
                          setPage("profile")
                        }
                      >
                        Update Profile
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              RECRUITER DASHBOARD
          ================================================= */}

          {page === "recruiter-dashboard" &&
            user?.role === "RECRUITER" && (

            <div className="recruiter-dashboard-page">

              <div className="page-heading">

                <div>

                  <h1>
                    Recruiter Dashboard
                  </h1>

                  <p>
                    Manage your company, job openings
                    and candidates from one place.
                  </p>

                </div>

              </div>

              <div className="recruiter-welcome-card">

                <div className="recruiter-welcome-icon">
                  🏢
                </div>

                <div>

                  <h2>
                    Welcome,{" "}
                    {user?.name ||
                      "Recruiter"}!
                  </h2>

                  <p>
                    Build your company profile
                    and start posting placement
                    opportunities.
                  </p>

                </div>

              </div>

              <div className="stats-grid">

                <div className="stat-card">

                  <div className="stat-icon">
                    💼
                  </div>

                  <div>

                    <h3>
                      {recruiterJobs.length}
                    </h3>

                    <p>
                      Posted Jobs
                    </p>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    👥
                  </div>

                  <div>

                    <h3>
                      {recruiterApplicantCount}
                    </h3>

                    <p>
                      Applicants
                    </p>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    ⭐
                  </div>

                  <div>

                    <h3>
                      {recruiterShortlistedCount != null
                        ? recruiterShortlistedCount
                        : "N/A"}
                    </h3>

                    <p>
                      Shortlisted
                    </p>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    📅
                  </div>

                  <div>

                    <h3>
                      {recruiterInterviewCount != null
                        ? recruiterInterviewCount
                        : "N/A"}
                    </h3>

                    <p>
                      Interviews
                    </p>

                  </div>

                </div>

              </div>

              <div className="dashboard-grid">

                <div className="dashboard-card">

                  <div className="card-header">

                    <h2>
                      🏢 Company Profile
                    </h2>

                  </div>

                  <p>
                    Create and manage your company
                    information so students can
                    learn about your organization.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() =>
                      setPage(
                        "company-profile"
                      )
                    }
                  >
                    Manage Company Profile
                  </button>

                </div>

                <div className="dashboard-card">

                  <div className="card-header">

                    <h2>
                      💼 Job Management
                    </h2>

                  </div>

                  <p>
                    Post new placement opportunities
                    and define eligibility criteria,
                    required skills and job details.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() =>
                      setPage(
                        "recruiter-jobs"
                      )
                    }
                  >
                    Manage Jobs
                  </button>

                </div>

              </div>

              <div className="dashboard-card">

                <div className="card-header">

                  <h2>
                    Quick Actions
                  </h2>

                </div>

                <div className="dashboard-grid">

                  <button
                    className="secondary-button"
                    onClick={() =>
                      setPage(
                        "company-profile"
                      )
                    }
                  >
                    🏢 Company Profile
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() =>
                      setPage(
                        "recruiter-jobs"
                      )
                    }
                  >
                    ➕ Post a New Job
                  </button>

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              STUDENT PROFILE
          ================================================= */}

          {page === "profile" &&
            user?.role === "STUDENT" && (

            <div className="profile-page">

              <div className="profile-header-card">

                <div className="large-avatar">

                  {(
                    studentProfile?.name ||
                    user?.name ||
                    "S"
                  )
                    .charAt(0)
                    .toUpperCase()}

                </div>

                <div>

                  <h1>
                    {studentProfile?.name ||
                      user?.name ||
                      "Student"}
                  </h1>

                  <p>
                    {studentProfile?.email ||
                      user?.email ||
                      ""}
                  </p>

                  <span className="role-badge">
                    STUDENT
                  </span>

                </div>

              </div>

              <div className="profile-edit-card">

                <h2>
                  ✏️ Student Profile
                </h2>

                {loadingProfile ? (

                  <div className="loading">
                    Loading profile...
                  </div>

                ) : !isEditingProfile ? (

                  <>

                    <div className="profile-form-grid">

                      <div className="form-group">
                        <label>
                          University Roll Number
                        </label>

                        <input
                          value={
                            profileForm.studentId
                          }
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Full Name
                        </label>

                        <input
                          value={
                            profileForm.name
                          }
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Email
                        </label>

                        <input
                          value={
                            profileForm.email
                          }
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Phone Number
                        </label>

                        <input
                          value={
                            profileForm.phone
                          }
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          CGPA
                        </label>

                        <input
                          value={
                            profileForm.cgpa
                          }
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          10th Percentage
                        </label>

                        <input
                          value={
                            profileForm.tenthPercentage
                          }
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          12th Percentage
                        </label>

                        <input
                          value={
                            profileForm.twelfthPercentage
                          }
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Active Backlogs
                        </label>

                        <input
                          value={
                            profileForm.backlogs
                          }
                          readOnly
                        />
                      </div>

                    </div>

                    <div className="profile-actions">

                      <button
                        className="primary-button"
                        onClick={() =>
                          setIsEditingProfile(
                            true
                          )
                        }
                      >
                        ✏️ Edit Profile
                      </button>

                    </div>

                  </>

                ) : (

                  <form
                    onSubmit={
                      saveProfile
                    }
                  >

                    <div className="profile-form-grid">

                      <div className="form-group">
                        <label>
                          University Roll Number
                        </label>

                        <input
                          value={
                            profileForm.studentId
                          }
                          onChange={(e) =>
                            handleProfileChange(
                              "studentId",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Full Name
                        </label>

                        <input
                          value={
                            profileForm.name
                          }
                          onChange={(e) =>
                            handleProfileChange(
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Email
                        </label>

                        <input
                          type="email"
                          value={
                            profileForm.email
                          }
                          onChange={(e) =>
                            handleProfileChange(
                              "email",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Phone Number
                        </label>

                        <input
                          value={
                            profileForm.phone
                          }
                          onChange={(e) =>
                            handleProfileChange(
                              "phone",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          CGPA
                        </label>

                        <input
                          type="number"
                          step="0.01"
                          value={
                            profileForm.cgpa
                          }
                          onChange={(e) =>
                            handleProfileChange(
                              "cgpa",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          10th Percentage
                        </label>

                        <input
                          type="number"
                          step="0.01"
                          value={
                            profileForm.tenthPercentage
                          }
                          onChange={(e) =>
                            handleProfileChange(
                              "tenthPercentage",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          12th Percentage
                        </label>

                        <input
                          type="number"
                          step="0.01"
                          value={
                            profileForm.twelfthPercentage
                          }
                          onChange={(e) =>
                            handleProfileChange(
                              "twelfthPercentage",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Active Backlogs
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={
                            profileForm.backlogs
                          }
                          onChange={(e) =>
                            handleProfileChange(
                              "backlogs",
                              e.target.value
                            )
                          }
                        />
                      </div>

                    </div>

                    <div className="profile-actions">

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
  setIsEditingProfile(false);

  if (studentProfile) {
    setProfileForm({
      studentId: studentProfile.studentId || "",
      name: studentProfile.name || "",
      email: studentProfile.email || "",
      phone: studentProfile.phone || "",
      cgpa: studentProfile.cgpa ?? "",
      tenthPercentage: studentProfile.tenthPercentage ?? "",
      twelfthPercentage: studentProfile.twelfthPercentage ?? "",
      backlogs: studentProfile.backlogs ?? "",
    });
  }

  setError("");
}}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="primary-button"
                        disabled={
                          savingProfile
                        }
                      >
                        {savingProfile
                          ? "Saving..."
                          : "💾 Save Profile"}
                      </button>

                    </div>

                  </form>

                )}

              </div>

              {/* =================================================
                  TECHNICAL SKILLS
              ================================================= */}

              <div className="skills-professional-card">

                <div className="skills-intro">

                  <div className="skills-intro-icon">
                    🛠️
                  </div>

                  <div>

                    <h2>
                      Technical Skills
                    </h2>

                    <p>
                      Add your technical skills
                      to build your professional
                      placement profile and
                      improve job matching.
                    </p>

                  </div>

                </div>

                <div className="skills-layout">

                  <div className="skills-filter-panel">

                    <label>
                      Search Skills
                    </label>

                    <div className="skills-search">

                      <span>
                        🔍
                      </span>

                      <input
                        type="text"
                        placeholder="Search technical skills..."
                        value={
                          skillSearch
                        }
                        onChange={(e) =>
                          setSkillSearch(
                            e.target.value
                          )
                        }
                      />

                    </div>

                    <label>
                      Category
                    </label>

                    <select
                      value={
                        selectedCategory
                      }
                      onChange={(e) =>
                        setSelectedCategory(
                          e.target.value
                        )
                      }
                    >

                      <option value="All">
                        All Categories
                      </option>

                      {Object.keys(
                        skillCategories
                      ).map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        )
                      )}

                    </select>

                    <div className="skills-filter-info">

                      <strong>
                        {allSkillsCount()}
                      </strong>

                      <span>
                        total technical skills
                      </span>

                    </div>

                  </div>

                  <div className="available-skills-panel">

                    <div className="skills-panel-header">

                      <div>

                        <h3>
                          Available Skills
                        </h3>

                        <p>
                          {skillsToAdd.length}{" "}
                          available
                        </p>

                      </div>

                    </div>

                    {loadingSkills ? (

                      <div className="skills-empty">
                        Loading skills...
                      </div>

                    ) : skillsToAdd.length === 0 ? (

                      <div className="skills-empty">
                        No matching skills found.
                      </div>

                    ) : (

                      <div className="skills-grid">

                        {skillsToAdd.map(
                          (skill) => {

                            const category =
                              Object.entries(
                                skillCategories
                              ).find(
                                ([, skillList]) =>
                                  skillList.some(
                                    (
                                      categorySkill
                                    ) =>
                                      categorySkill.toLowerCase() ===
                                      skill.name?.toLowerCase()
                                  )
                              )?.[0] ||
                              "Technical Skill";

                            return (
                              <div
                                className="skill-card"
                                key={
                                  skill.id
                                }
                              >

                                <div>

                                  <h4>
                                    {
                                      skill.name
                                    }
                                  </h4>

                                  <span>
                                    {
                                      category
                                    }
                                  </span>

                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    addSkillToStudent(
                                      skill.id
                                    )
                                  }
                                  disabled={
                                    addingSkill
                                  }
                                >
                                  {addingSkill
                                    ? "Adding..."
                                    : "+ Add"}
                                </button>

                              </div>
                            );
                          }
                        )}

                      </div>

                    )}

                  </div>

                  <div className="selected-skills-panel">

                    <div className="skills-panel-header">

                      <div>

                        <h3>
                          My Selected Skills
                        </h3>

                        <p>
                          {
                            studentSkills.length
                          }{" "}
                          selected
                        </p>

                      </div>

                    </div>

                    {studentSkills.length === 0 ? (

                      <div className="selected-empty">

                        <div>
                          🎯
                        </div>

                        <p>
                          No skills selected yet.
                        </p>

                        <span>
                          Add skills from
                          the available
                          skills list.
                        </span>

                      </div>

                    ) : (

                      <div className="selected-skills-list">

                        {studentSkills.map(
                          (
                            studentSkill
                          ) => (

                            <div
                              className="selected-skill"
                              key={
                                studentSkill.id
                              }
                            >

                              <span>
                                ✓{" "}
                                {
                                  studentSkill
                                    .skill
                                    ?.name
                                }
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  removeSkillFromStudent(
                                    studentSkill
                                      .skill
                                      ?.id
                                  )
                                }
                                disabled={
                                  removingSkillId ===
                                  studentSkill
                                    .skill
                                    ?.id
                                }
                              >
                                ×
                              </button>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                </div>

              </div>

              {/* =================================================
                  RESUME
              ================================================= */}

              <div className="resume-card">

                <div>

                  <h2>
                    📄 Resume
                  </h2>

                  <p>
                    Upload your latest
                    resume for recruiters.
                  </p>

                </div>
              <div>

  {resumeUploaded ? (

    <div>
      <div className="resume-success">
        ✅ Resume uploaded
      </div>
     <button
  type="button"
  className="shortlist-button"
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API}/resumes/student/${application.student.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resume error:", response.status, errorText);
        alert(`Unable to open resume. Status: ${response.status}`);
        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (error) {
      console.error("Resume error:", error);
      alert(`Unable to open resume: ${error.message}`);
    }
  }}
>
  👁 View Resume
</button>
      <label
        className="upload-button"
        style={{
          marginTop: "12px",
          cursor: "pointer"
        }}
      >
        🔄 Replace Resume

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeUpload}
          hidden
        />

      </label>
    </div>

  ) : (

    <label className="upload-button">

      Upload Resume

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleResumeUpload}
        hidden
      />

    </label>

  )}

</div>
                

              </div>

            </div>
          )}
        

          {/* =================================================
              COMPANY PROFILE
          ================================================= */}

          {page === "company-profile" &&
            user?.role === "RECRUITER" && (

            <div className="company-profile-page">

              <div className="page-heading">

                <div>

                  <h1>
                    Company Profile
                  </h1>

                  <p>
                    Create and manage your
                    company's placement profile.
                  </p>

                </div>

              </div>

              <div className="profile-edit-card">

                <h2>
                  🏢 Company Information
                </h2>

                <div className="profile-form-grid">

                  <div className="form-group">

                    <label>
                      Company Name
                    </label>

                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={
                        companyForm.companyName ||
                        ""
                      }
                      onChange={(e) =>
                        setCompanyForm(
                          (previous) => ({
                            ...previous,
                            companyName:
                              e.target.value,
                          })
                        )
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Industry
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Information Technology"
                      value={
                        companyForm.industry ||
                        ""
                      }
                      onChange={(e) =>
                        setCompanyForm(
                          (previous) => ({
                            ...previous,
                            industry:
                              e.target.value,
                          })
                        )
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Location
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Hyderabad"
                      value={
                        companyForm.location ||
                        ""
                      }
                      onChange={(e) =>
                        setCompanyForm(
                          (previous) => ({
                            ...previous,
                            location:
                              e.target.value,
                          })
                        )
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Website
                    </label>

                    <input
                      type="url"
                      placeholder="https://company.com"
                      value={
                        companyForm.website ||
                        ""
                      }
                      onChange={(e) =>
                        setCompanyForm(
                          (previous) => ({
                            ...previous,
                            website:
                              e.target.value,
                          })
                        )
                      }
                    />

                  </div>

                </div>

                <div className="form-group">

                  <label>
                    Company Description
                  </label>

                  <textarea
                    rows="5"
                    placeholder="Describe your company, work culture and opportunities..."
                    value={
                      companyForm.description ||
                      ""
                    }
                    onChange={(e) =>
                      setCompanyForm(
                        (previous) => ({
                          ...previous,
                          description:
                            e.target.value,
                        })
                      )
                    }
                  />

                </div>

                <div className="profile-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setPage(
                        "recruiter-dashboard"
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={
                      saveCompanyProfile
                    }
                    disabled={
                      savingCompany
                    }
                  >
                    {savingCompany
                      ? "Saving..."
                      : "💾 Save Company Profile"}
                  </button>

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              RECRUITER JOB MANAGEMENT
          ================================================= */}

          {page === "recruiter-jobs" &&
            user?.role === "RECRUITER" && (

            <div className="recruiter-jobs-page">

              <div className="page-heading">

                <div>

                  <h1>
                    Job Management
                  </h1>

                  <p>
                    Create and manage placement
                    opportunities for students.
                  </p>

                </div>

                <button
                  className="primary-button"
                  onClick={() =>
                    setShowJobForm(true)
                  }
                >
                  ➕ Post New Job
                </button>

              </div>

              {showJobForm && (

                <div className="profile-edit-card">

                  <h2>
                    {editingJobId ? "✏️ Edit Job" : "💼 Post a New Job"}
                  </h2>

                  <div className="profile-form-grid">

                    <div className="form-group">

                      <label>
                        Job Title
                      </label>

                      <input
                        type="text"
                        placeholder="e.g. Software Engineer"
                        value={
                          jobForm.jobTitle
                        }
                        onChange={(e) =>
                          setJobForm(
                            (previous) => ({
                              ...previous,
                              jobTitle:
                                e.target.value,
                            })
                          )
                        }
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Location
                      </label>

                      <input
                        type="text"
                        placeholder="e.g. Hyderabad"
                        value={
                          jobForm.location
                        }
                        onChange={(e) =>
                          setJobForm(
                            (previous) => ({
                              ...previous,
                              location:
                                e.target.value,
                            })
                          )
                        }
                      />

                    </div>

                  </div>

                  <div className="form-group">

                    <label>
                      Job Description
                    </label>

                    <textarea
                      rows="5"
                      placeholder="Describe the job role and responsibilities..."
                      value={
                        jobForm.description
                      }
                      onChange={(e) =>
                        setJobForm(
                          (previous) => ({
                            ...previous,
                            description:
                              e.target.value,
                          })
                        )
                      }
                    />

                  </div>

                  <h3>
                    Academic Eligibility
                  </h3>

                  <div className="profile-form-grid">

                    <div className="form-group">

                      <label>
                        Minimum CGPA
                      </label>

                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 7.0"
                        value={
                          jobForm.minimumCgpa
                        }
                        onChange={(e) =>
                          setJobForm(
                            (previous) => ({
                              ...previous,
                              minimumCgpa:
                                e.target.value,
                            })
                          )
                        }
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Maximum Backlogs
                      </label>

                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 0"
                        value={
                          jobForm.maximumBacklogs
                        }
                        onChange={(e) =>
                          setJobForm(
                            (previous) => ({
                              ...previous,
                              maximumBacklogs:
                                e.target.value,
                            })
                          )
                        }
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Minimum 10th Percentage
                      </label>

                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 60"
                        value={
                          jobForm.minimumTenthPercentage
                        }
                        onChange={(e) =>
                          setJobForm(
                            (previous) => ({
                              ...previous,
                              minimumTenthPercentage:
                                e.target.value,
                            })
                          )
                        }
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Minimum 12th Percentage
                      </label>

                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 60"
                        value={
                          jobForm.minimumTwelfthPercentage
                        }
                        onChange={(e) =>
                          setJobForm(
                            (previous) => ({
                              ...previous,
                              minimumTwelfthPercentage:
                                e.target.value,
                            })
                          )
                        }
                      />

                    </div>

                  </div>
                                      <div>
                      <div className="form-group">
  <label>
    Required Skills
  </label>

  {/* Selected skills */}
  {selectedJobSkills.length > 0 && (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "10px",
        marginBottom: "10px",
      }}
    >
      {selectedJobSkills.map((skillId) => {
        const skill = availableSkills.find(
          (item) => item.id === skillId
        );

        if (!skill) return null;

        return (
          <span
            key={skill.id}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 10px",
              borderRadius: "20px",
              background: "#eef2ff",
              color: "#4338ca",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {skill.name}

            <button
              type="button"
              onClick={() =>
                setSelectedJobSkills(
                  (previous) =>
                    previous.filter(
                      (id) => id !== skill.id
                    )
                )
              }
              style={{
                border: "none",
                background: "transparent",
                color: "#4338ca",
                cursor: "pointer",
                fontSize: "16px",
                padding: "0",
                lineHeight: "1",
              }}
            >
              ×
            </button>
          </span>
        );
      })}
    </div>
  )}

  {/* Search skills */}
  <input
    type="text"
    placeholder="🔍 Search skills..."
    value={skillSearch}
    onChange={(e) =>
      setSkillSearch(e.target.value)
    }
  />

  {/* Skill results */}
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginTop: "10px",
      maxHeight: "180px",
      overflowY: "auto",
      padding: "8px",
      border: "1px solid #ddd",
      borderRadius: "8px",
    }}
  >
    {availableSkills
      .filter((skill) =>
        skill.name
          ?.toLowerCase()
          .includes(
            skillSearch.toLowerCase()
          )
      )
      .map((skill) => {
        const isSelected =
          selectedJobSkills.includes(
            skill.id
          );

        return (
          <button
            key={skill.id}
            type="button"
            onClick={() => {
              setSelectedJobSkills(
                (previous) =>
                  isSelected
                    ? previous.filter(
                        (id) =>
                          id !== skill.id
                      )
                    : [
                        ...previous,
                        skill.id,
                      ]
              );
            }}
            style={{
              padding: "7px 12px",
              borderRadius: "18px",
              border: isSelected
                ? "1px solid #4f46e5"
                : "1px solid #d1d5db",
              background: isSelected
                ? "#eef2ff"
                : "#ffffff",
              color: isSelected
                ? "#4338ca"
                : "#374151",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {isSelected ? "✓ " : ""}
            {skill.name}
          </button>
        );
      })}
  </div>
</div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                          marginTop: "8px",
                        }}
                      >
                        {availableSkills.map(
                          (skill) => (
                            <label
                              key={skill.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                cursor: "pointer",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedJobSkills.includes(
                                  skill.id
                                )}
                                onChange={(e) => {
                                  setSelectedJobSkills(
                                    (previous) =>
                                      e.target.checked
                                        ? [
                                            ...previous,
                                            skill.id,
                                          ]
                                        : previous.filter(
                                            (id) =>
                                              id !==
                                              skill.id
                                          )
                                  );
                                }}
                              />

                              {skill.name}
                            </label>
                          )
                        )}
                      </div>
                    </div>

                  <div className="profile-actions">

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        setShowJobForm(false);

                        setJobForm({
  jobTitle: "",
  location: "",
  description: "",
  minimumCgpa: "",
  maximumBacklogs: "",
  minimumTenthPercentage: "",
  minimumTwelfthPercentage: "",
  status: "OPEN",
});

setEditingJobId(null);
setSelectedJobSkills([]);
setSkillSearch("");
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="primary-button"
                      onClick={
                        saveRecruiterJob
                      }
                    >
                      💾 Save Job
                    </button>

                  </div>

                </div>

              )}

              <div className="jobs-grid">

                {recruiterJobs.map(
                  (job) => (

                    <div
                      className="job-card"
                      key={job.id}
                    >

                      <div className="job-card-top">

                        <div className="company-logo">
                          {(job.companyName ||
                            "C")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    marginBottom: "15px",
  }}
>
  <span
    style={{
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "600",
      background:
        job.status === "CLOSED"
          ? "#fee2e2"
          : "#dcfce7",
      color:
        job.status === "CLOSED"
          ? "#b91c1c"
          : "#15803d",
    }}
  >
    {job.status === "CLOSED" ? "🔴 CLOSED" : "🟢 OPEN"}
  </span>

  <div
    style={{
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    }}
  >
  

    <button
  type="button"
  className="secondary-button"
  onClick={() => editRecruiterJob(job)}
>
  ✏️ Edit
</button>

<button
  type="button"
  className="secondary-button"
  onClick={() => toggleJobStatus(job)}
>
  {job.status === "CLOSED"
    ? "🔓 Reopen"
    : "🔒 Close"}
</button>

    <button
      className="danger-button"
      onClick={() => deleteRecruiterJob(job.id)}
    >
      🗑️ Delete
    </button>
  </div>
</div>

                        <div>

                          <h2>
                            {job.jobTitle}
                          </h2>

                          <p>
                            {job.companyName}
                          </p>

                        </div>

                      </div>

                      <div className="job-info">

                        <span>
                          📍{" "}
                          {job.location ||
                            "India"}
                        </span>

                      </div>

                      <p className="job-description">
                        {job.description ||
                          "No job description available."}
                      </p>

                      <div className="job-requirements">

                        <h4>
                          Academic Requirements
                        </h4>

                        <div className="requirements-grid">

                          <span>
                            🎓 CGPA:{" "}
                            {job.minimumCgpa ??
                              "N/A"}+
                          </span>

                          <span>
                            📘 10th:{" "}
                            {job.minimumTenthPercentage ??
                              "N/A"}%
                          </span>

                          <span>
                            📗 12th:{" "}
                            {job.minimumTwelfthPercentage ??
                              "N/A"}%
                          </span>

                          <span>
                            📋 Backlogs:{" "}
                            {job.maximumBacklogs ??
                              "N/A"} max
                          </span>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

              {recruiterJobs.length === 0 &&
                !showJobForm && (

                <div className="empty-state">

                  <h3>
                    No jobs posted yet
                  </h3>

                  <p>
                    Click "Post New Job"
                    to create your first
                    placement opportunity.
                  </p>

                </div>

              )}

            </div>
          )}

          {/* =================================================
              RECRUITER INTERVIEWS
          ================================================= */}

          {page === "recruiter-interviews" &&
            user?.role === "RECRUITER" && (

            <div className="recruiter-interviews-page">

              <div className="page-heading">

                <div>

                  <h1>
                    📅 Interviews
                  </h1>

                  <p>
                    View and manage interviews scheduled
                    for your company.
                  </p>

                </div>

              </div>

              {loadingRecruiterInterviews ? (

                <div className="dashboard-card">

                  <div className="loading-state">
                    Loading interviews...
                  </div>

                </div>

              ) : recruiterInterviews.length === 0 ? (

                <div className="dashboard-card">

                  <div className="empty-state">

                    <h3>
                      📭 No Interviews Scheduled
                    </h3>

                    <p>
                      Interviews scheduled for your company
                      will appear here.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="interview-list">

                  {recruiterInterviews.map(
                    (interview) => {

                      const application =
                        interview.application;

                      const student =
                        application?.student;

                      const job =
                        application?.job;

                      return (
                        <div
                          className="dashboard-card interview-card"
                          key={interview.id}
                        >

                          <div className="card-header">

                            <div>

                              <h2>
                                👤{" "}
                                {student?.name ||
                                  "Student"}
                              </h2>

                              <p>
                                📧{" "}
                                {student?.email ||
                                  "Email not available"}
                              </p>

                            </div>

                            <span className="status-badge">
                              {interview.status ||
                                "SCHEDULED"}
                            </span>

                          </div>

                          <div className="interview-details">

                            <div>
                              <strong>💼 Job</strong>
                              <p>
                                {job?.jobTitle ||
                                  "Job not available"}
                              </p>
                            </div>

                            <div>
                              <strong>🏢 Company</strong>
                              <p>
                                {job?.companyName ||
                                  "Company"}
                              </p>
                            </div>

                            <div>
                              <strong>📅 Date</strong>
                              <p>
                                {interview.interviewDate ||
                                  "Date not available"}
                              </p>
                            </div>

                            <div>
                              <strong>🕐 Time</strong>
                              <p>
                                {interview.interviewTime ||
                                  "Time not available"}
                              </p>
                            </div>

                            <div>
                              <strong>💻 Mode</strong>
                              <p>
                                {interview.mode ||
                                  "Online"}
                              </p>
                            </div>

                            <div>
                              <strong>📍 Location</strong>
                              <p>
                                {interview.location ||
                                  "Not specified"}
                              </p>
                            </div>

                          </div>

                          <div className="interview-status-section">

                            <span className="status-badge">
                              Status:{" "}
                              {interview.status ||
                                "SCHEDULED"}
                            </span>

                            <span className="result-badge">
                              Result:{" "}
                              {interview.result ||
                                "Pending"}
                            </span>

                          </div>

                          <div className="job-card-actions">

                            <button
                              type="button"
                              className="secondary-button"
                              disabled={
                                updatingInterviewId ===
                                interview.id
                              }
                              onClick={async () => {
                                try {
                                  setUpdatingInterviewId(
                                    interview.id
                                  );

                                  await axios.put(
                                    `${API}/interviews/${interview.id}/status`,
                                    null,
                                    {
                                      params: {
                                        status:
                                          "COMPLETED",
                                      },
                                    }
                                  );

                                  setMessage(
                                    "Interview marked as completed."
                                  );

                                  await loadRecruiterInterviews();

                                } catch (err) {
                                  console.error(err);

                                  setError(
                                    "Failed to update interview status."
                                  );
                                } finally {
                                  setUpdatingInterviewId(
                                    null
                                  );
                                }
                              }}
                            >
                              {updatingInterviewId ===
                              interview.id
                                ? "Updating..."
                                : "✅ Completed"}
                            </button>

                            <button
                              type="button"
                              className="danger-button"
                              disabled={
                                updatingInterviewId ===
                                interview.id
                              }
                              onClick={async () => {
                                try {
                                  setUpdatingInterviewId(
                                    interview.id
                                  );

                                  await axios.put(
                                    `${API}/interviews/${interview.id}/status`,
                                    null,
                                    {
                                      params: {
                                        status:
                                          "CANCELLED",
                                      },
                                    }
                                  );

                                  setMessage(
                                    "Interview cancelled."
                                  );

                                  await loadRecruiterInterviews();

                                } catch (err) {
                                  console.error(err);

                                  setError(
                                    "Failed to cancel interview."
                                  );
                                } finally {
                                  setUpdatingInterviewId(
                                    null
                                  );
                                }
                              }}
                            >
                              {updatingInterviewId ===
                              interview.id
                                ? "Updating..."
                                : "❌ Cancel"}
                            </button>

                            <button
                              type="button"
                              className="primary-button"
                              onClick={async () => {
                                try {
                                  await axios.put(
                                    `${API}/interviews/${interview.id}/result`,
                                    null,
                                    {
                                      params: {
                                        result:
                                          "SELECTED",
                                      },
                                    }
                                  );

                                  setMessage(
                                    "Student marked as selected."
                                  );

                                  await loadRecruiterInterviews();

                                } catch (err) {
                                  console.error(err);

                                  setError(
                                    "Failed to update interview result."
                                  );
                                }
                              }}
                            >
                              🎉 Select
                            </button>

                            <button
                              type="button"
                              className="danger-button"
                              onClick={async () => {
                                try {
                                  await axios.put(
                                    `${API}/interviews/${interview.id}/result`,
                                    null,
                                    {
                                      params: {
                                        result:
                                          "REJECTED",
                                      },
                                    }
                                  );

                                  setMessage(
                                    "Student marked as rejected."
                                  );

                                  await loadRecruiterInterviews();

                                } catch (err) {
                                  console.error(err);

                                  setError(
                                    "Failed to update interview result."
                                  );
                                }
                              }}
                            >
                              🚫 Reject
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </div>
          )}

          {/* =================================================
              RECRUITER APPLICANTS PAGE
          ================================================= */}

          {page === "recruiter-applicants" &&
            user?.role === "RECRUITER" && (

            <div className="recruiter-applicants-page">

              <div className="page-heading">

                <div>

                  <h1>
                    👥 Applicants
                  </h1>

                  <p>
                    View and manage students who applied
                    to your jobs.
                  </p>

                </div>

              </div>

              <div className="dashboard-card">

                <div className="card-header">

                  <div>

                    <h2>
                      📋 Select Job
                    </h2>

                    <p>
                      Choose a job to view its applicants.
                    </p>

                  </div>

                </div>

                {recruiterJobs.length === 0 ? (

                  <div className="empty-state">

                    <h3>
                      No jobs available
                    </h3>

                    <p>
                      Create a job first from Manage Jobs.
                    </p>

                  </div>

                ) : (

                  <div className="form-group">

                    <label>
                      Job
                    </label>

                    <select
                      className="form-control"
                      value={
                        selectedRecruiterJob?.id || ""
                      }
                      onChange={(event) => {

                        const selectedJob =
                          recruiterJobs.find(
                            (job) =>
                              String(job.id) ===
                              String(
                                event.target.value
                              )
                          );

                        if (selectedJob) {
                          loadJobApplicants(
                            selectedJob
                          );
                        } else {
                          setSelectedRecruiterJob(null);
                          setJobApplicants([]);
                        }

                      }}
                    >

                      <option value="">
                        Select a job
                      </option>

                      {recruiterJobs.map(
                        (job) => (

                          <option
                            key={job.id}
                            value={job.id}
                          >
                            {job.jobTitle} —{" "}
                            {job.companyName}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                )}

              </div>

              {selectedRecruiterJob && (

                <div className="dashboard-card applicants-card">

                  <div className="card-header">

                    <div>

                      <h2>
                        👥 Applicants
                      </h2>

                      <p>
                        {selectedRecruiterJob.jobTitle} —{" "}
                        {selectedRecruiterJob.companyName}
                      </p>

                    </div>

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        setSelectedRecruiterJob(null);
                        setJobApplicants([]);
                      }}
                    >
                      Close
                    </button>

                  </div>

                  {loadingApplicants ? (

                    <div className="empty-state">

                      <h3>
                        Loading applicants...
                      </h3>

                    </div>

                  ) : jobApplicants.length === 0 ? (

                    <div className="empty-state">

                      <h3>
                        No applicants yet
                      </h3>

                      <p>
                        Students who apply for this
                        job will appear here.
                      </p>

                    </div>

                  ) : (

                    <div className="applicant-list">

                      {jobApplicants.map(
                        (application) => {

                          const student =
                            application.student || {};

                          return (

                            <div
                              className="applicant-card"
                              key={application.id}
                            >

                              <div className="applicant-info">

                                <div className="applicant-avatar">

                                  {(
                                    student.name ||
                                    "S"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>

                                <div>

                                  <h3>
                                    {student.name ||
                                      "Student"}
                                  </h3>

                                  <p>
                                    📧{" "}
                                    {student.email ||
                                      "Email unavailable"}
                                  </p>

                                  <p>
                                    📱{" "}
                                    {student.phone ||
                                      "Phone unavailable"}
                                  </p>

                                </div>

                              </div>

                              <div className="applicant-academics">

                                <span>
                                  🎓 CGPA:{" "}
                                  {student.cgpa ??
                                    "N/A"}
                                </span>

                                <span>
                                  📘 10th:{" "}
                                  {student.tenthPercentage ??
                                    "N/A"}%
                                </span>

                                <span>
                                  📗 12th:{" "}
                                  {student.twelfthPercentage ??
                                    "N/A"}%
                                </span>

                                <span>
                                  📋 Backlogs:{" "}
                                  {student.backlogs ??
                                    "N/A"}
                                </span>

                              </div>

                              <div className="applicant-status">

                                <span className="status-badge">
                                  {application.status ||
                                    "APPLIED"}
                                </span>

                                <small>
                                  Applied:{" "}
                                  {application.applicationDate
                                    ? new Date(
                                        application.applicationDate
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </small>

                              </div>

                              <div className="applicant-actions">

                                <div style={{ display: "flex", gap: "10px" }}>
  <button
    type="button"
    className="shortlist-button"
    onClick={async () => {
      try {
        const response = await axios.get(
          `${API}/resumes/student/${application.student.id}`,
          {
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(response.data);
        window.open(url, "_blank");
      } catch (error) {
        console.error("Resume error:", error);
        alert("Unable to open resume.");
      }
    }}
  >
    👁 View Resume
  </button>

  <button
    type="button"
    className="shortlist-button"
    disabled={updatingApplicationId === application.id}
    onClick={() =>
      updateApplicantStatus(
        application.id,
        "SHORTLISTED"
      )
    }
  >
    {updatingApplicationId === application.id
      ? "Updating..."
      : "⭐ Shortlist"}
  </button>
</div>

                                {application.status ===
                                  "SHORTLISTED" && (

                                  <button
                                    type="button"
                                    className="interview-button"
                                    onClick={() => {
                                      setSelectedInterviewApplication(
                                        application
                                      );

                                      setShowInterviewForm(
                                        true
                                      );
                                    }}
                                  >
                                    📅 Schedule Interview
                                  </button>

                                )}

                                <button
                                  type="button"
                                  className="reject-button"
                                  disabled={
                                    updatingApplicationId ===
                                    application.id
                                  }
                                  onClick={() =>
                                    updateApplicantStatus(
                                      application.id,
                                      "REJECTED"
                                    )
                                  }
                                >
                                  ❌ Reject
                                </button>

                              </div>

                            </div>

                          );
                        }
                      )}

                    </div>

                  )}

                </div>

              )}

              {/* =================================================
                  SCHEDULE INTERVIEW FORM
              ================================================= */}

              {showInterviewForm &&
                selectedInterviewApplication && (

                <div className="dashboard-card interview-form-card">

                  <div className="card-header">

                    <div>

                      <h2>
                        📅 Schedule Interview
                      </h2>

                      <p>
                        Schedule an interview for{" "}
                        <strong>
                          {selectedInterviewApplication
                            .student
                            ?.name ||
                            "Student"}
                        </strong>
                      </p>

                    </div>

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        setShowInterviewForm(
                          false
                        );

                        setSelectedInterviewApplication(
                          null
                        );
                      }}
                    >
                      Cancel
                    </button>

                  </div>

                  <form
                    onSubmit={(event) => {

                      event.preventDefault();

                      const formData =
                        new FormData(
                          event.currentTarget
                        );

                      scheduleInterview({
                        applicationId:
                          selectedInterviewApplication.id,

                        date:
                          formData.get("date"),

                        time:
                          formData.get("time"),

                        mode:
                          formData.get("mode"),

                        location:
                          formData.get("location"),
                      });

                    }}
                  >

                    <div className="form-group">

                      <label>
                        Interview Date
                      </label>

                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Interview Time
                      </label>

                      <input
                        type="time"
                        name="time"
                        className="form-control"
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Interview Mode
                      </label>

                      <select
                        name="mode"
                        className="form-control"
                        required
                      >

                        <option value="">
                          Select mode
                        </option>

                        <option value="Online">
                          💻 Online
                        </option>

                        <option value="Offline">
                          🏢 Offline
                        </option>

                        <option value="Hybrid">
                          🔄 Hybrid
                        </option>

                      </select>

                    </div>

                    <div className="form-group">

                      <label>
                        Meeting Link / Location
                      </label>

                      <input
                        type="text"
                        name="location"
                        className="form-control"
                        placeholder="Enter meeting link or interview location"
                        required
                      />

                    </div>

                    <button
                      type="submit"
                      className="primary-button"
                    >
                      📅 Schedule Interview
                    </button>

                  </form>

                </div>

              )}

            </div>
          )}

          {/* =================================================
              STUDENT JOBS
          ================================================= */}

          {page === "jobs" &&
            user?.role === "STUDENT" && (

            <div className="jobs-page">

              <div className="page-heading">

                <div>

                  <h1>
                    Job Opportunities
                  </h1>

                  <p>
                    Explore placement opportunities
                    available for you based on
                    your profile.
                  </p>

                </div>

              </div>

              <div className="jobs-grid">

                {jobs.map((job) => {

                  const match =
                    matchingData.find(
                      (item) =>
                        String(
                          item.jobId
                        ) ===
                        String(job.id)
                    );

                  const matchPercentage =
                    Math.round(
                      match?.overallMatchPercentage ||
                        0
                    );

                  const isEligible =
                    match?.eligible ??
                    false;

                  const jobSkills =
                    Array.isArray(
                      job.skills
                    )
                      ? job.skills
                      : String(
                          job.skills || ""
                        )
                          .split(",")
                          .map(
                            (skill) =>
                              skill.trim()
                          )
                          .filter(Boolean);

                  return (
                    <div
                      className="job-card"
                      key={job.id}
                    >

                      <div className="job-card-top">
                                            </div>

                      <div
                        style={{
                          display: "inline-block",
                          marginTop: "10px",
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "600",
                          background:
                            job.status === "CLOSED"
                              ? "#fee2e2"
                              : "#dcfce7",
                          color:
                            job.status === "CLOSED"
                              ? "#b91c1c"
                              : "#166534",
                        }}
                      >
                        {job.status === "CLOSED"
                          ? "● Closed"
                          : "● Open"}
                      </div>

                      <div className="job-info">
                        <div className="company-logo">

                          {(job.companyName ||
                            "C")
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <h2>
                            {job.jobTitle}
                          </h2>

                          <p>
                            {job.companyName}
                          </p>

                        </div>

                      </div>
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    marginBottom: "15px",
    gap: "10px",
    flexWrap: "wrap",
  }}
>
  <span
    style={{
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "600",
      backgroundColor:
        job.status === "CLOSED"
          ? "#fee2e2"
          : "#dcfce7",
      color:
        job.status === "CLOSED"
          ? "#b91c1c"
          : "#15803d",
    }}
  >
    {job.status === "CLOSED"
      ? "🔴 CLOSED"
      : "🟢 OPEN"}
  </span>

  <div
    style={{
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    }}
  >
    {user?.role === "RECRUITER" && (
  <>
    {user?.role === "RECRUITER" && (
  <button
    type="button"
    className="secondary-button"
    onClick={() => editRecruiterJob(job)}
  >
    ✏️ Edit
  </button>
)}

    <button
      className="secondary-button"
      onClick={() => toggleJobStatus(job)}
    >
      {job.status === "CLOSED"
        ? "🔓 Reopen"
        : "🔒 Close"}
    </button>

    {user?.role === "RECRUITER" && (
  <button
    type="button"
    className="danger-button"
    onClick={() => deleteRecruiterJob(job.id)}
  >
    🗑️ Delete
  </button>
)}
  </>
)}
  </div>
</div>
                      <div className="job-info">

                        <span>
                          📍{" "}
                          {job.location ||
                            "India"}
                        </span>

                        <span>
                          🎯{" "}
                          {matchPercentage}%
                          Match
                        </span>

                      </div>

                      <div className="job-eligibility">

                        <strong>
                          {isEligible
                            ? "✅ Eligible"
                            : "⚠️ Not Eligible"}
                        </strong>

                        <span>
                          {isEligible
                            ? "You meet the academic requirements"
                            : "You currently do not meet all requirements"}
                        </span>

                      </div>

                      <p className="job-description">

                        {job.description ||
                          "Explore this placement opportunity and check your eligibility."}

                      </p>

                      <div className="job-requirements">

                        <h4>
                          Academic Requirements
                        </h4>

                        <div className="requirements-grid">

                          <span>
                            🎓 CGPA:{" "}
                            {job.minimumCgpa ??
                              "N/A"}+
                          </span>

                          <span>
                            📘 10th:{" "}
                            {job.minimumTenthPercentage ??
                              "N/A"}%
                          </span>

                          <span>
                            📗 12th:{" "}
                            {job.minimumTwelfthPercentage ??
                              "N/A"}%
                          </span>

                          <span>
                            📋 Backlogs:{" "}
                            {job.maximumBacklogs ??
                              "N/A"} max
                          </span>

                        </div>
                                              {user?.role === "RECRUITER" && (
                        <div
                          style={{
                            marginTop: "15px",
                          }}
                        >
                            {user?.role === "RECRUITER" && (
  <button
    type="button"
    className="secondary-button"
    onClick={async () => {
      try {
        const newStatus =
          job.status === "CLOSED"
            ? "OPEN"
            : "CLOSED";

        await axios.put(
          `${API}/jobs/${job.id}/status`,
          newStatus,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        await loadRecruiterJobs();
        await loadJobs();

        setMessage(
          newStatus === "CLOSED"
            ? "Job closed successfully."
            : "Job reopened successfully."
        );
      } catch (err) {
        console.error(
          "Job status update error:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Unable to update job status."
        );
      }
    }}
  >
    {job.status === "CLOSED"
      ? "↻ Reopen Job"
      : "🔒 Close Job"}
  </button>
)}
                        </div>
                      )}
                                            <div
                        style={{
                          marginTop: "15px",
                        }}
                      >
            
                      </div>
                      </div>

                      <div className="job-skills-section">

                        <h4>
                          Required Skills
                        </h4>

                        <div className="job-skills">

                          {jobSkills.length >
                          0 ? (

                            jobSkills
                              .slice(0, 8)
                              .map(
                                (
                                  skill,
                                  index
                                ) => (

                                  <span
                                    key={
                                      index
                                    }
                                  >
                                    {skill}
                                  </span>

                                )
                              )

                          ) : (

                            <span>
                              No specific
                              skills listed
                            </span>

                          )}

                        </div>

                      </div>

                      {match && (

                        <div className="job-match-summary">

                          <div>

                            <span>
                              Skill Match
                            </span>

                            <strong>
                              {Math.round(
                                match.skillMatchPercentage ||
                                  0
                              )}
                              %
                            </strong>

                          </div>

                          <div>

                            <span>
                              Academic Score
                            </span>

                            <strong>
                              {Math.round(
                                match.academicScore ||
                                  0
                              )}
                              %
                            </strong>

                          </div>

                        </div>

                      )}

                      {job.status === "CLOSED" ? (
  <button
    className="secondary-button"
    disabled
    style={{
      cursor: "not-allowed",
      opacity: 0.7,
    }}
  >
    🔴 Applications Closed
  </button>
) : (
  <button
    className="primary-button"
    onClick={() =>
      openApplyModal(job)
    }
  >
    View & Apply
  </button>
)}

                    </div>
                  );
                })}

              </div>

              {jobs.length === 0 && (

                <div className="empty-state">

                  <h3>
                    No job opportunities
                    available
                  </h3>

                  <p>
                    New placement opportunities
                    will appear here.
                  </p>

                </div>

              )}

            </div>
          )}

          {/* =================================================
              MATCHING
          ================================================= */}

          {page === "matching" &&
            user?.role === "STUDENT" && (

            <div className="matching-page">

              <div className="page-heading">

                <div>

                  <h1>
                    Job Matching
                  </h1>

                  <p>
                    Find opportunities based
                    on your skills, academics
                    and eligibility.
                  </p>

                </div>

              </div>

              {matchingData.length === 0 ? (

                <div className="table-card">

                  <div className="empty-state">

                    <h3>
                      No matching data available
                    </h3>

                    <p>
                      Add your skills and
                      academic details to
                      calculate your job matches.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="matching-grid">

                  {matchingData.map(
                    (match) => (

                      <div
                        className="matching-card"
                        key={`${match.studentId}-${match.jobId}`}
                      >

                        <div className="matching-header">

                          <div>

                            <h2>
                              {
                                match.jobTitle
                              }
                            </h2>

                            <p>
                              {
                                match.companyName
                              }
                            </p>

                          </div>

                          <div className="match-score">

                            {Math.round(
                              match.overallMatchPercentage ||
                                0
                            )}
                            %

                            <small>
                              Match
                            </small>

                          </div>

                        </div>

                        <div className="match-progress">

                          <div
                            className="match-progress-fill"
                            style={{
                              width: `${Math.min(
                                match.overallMatchPercentage ||
                                  0,
                                100
                              )}%`,
                            }}
                          />

                        </div>

                        <div className="matching-details">

                          <p>
                            <strong>
                              Skill Match:
                            </strong>{" "}
                            {Math.round(
                              match.skillMatchPercentage ||
                                0
                            )}
                            %
                          </p>

                          <p>
                            <strong>
                              Academic Score:
                            </strong>{" "}
                            {Math.round(
                              match.academicScore ||
                                0
                            )}
                            %
                          </p>

                          <p>
                            <strong>
                              Eligibility:
                            </strong>{" "}
                            {match.eligible
                              ? "Eligible"
                              : "Not Eligible"}
                          </p>

                        </div>

                        {match.matchedSkills &&
                          match.matchedSkills.length >
                            0 && (

                            <div className="skill-section">

                              <strong>
                                Matched Skills
                              </strong>

                              <div className="job-skills">

                                {match.matchedSkills.map(
                                  (
                                    skill,
                                    index
                                  ) => (

                                    <span
                                      key={
                                        index
                                      }
                                    >
                                      ✓{" "}
                                      {skill}
                                    </span>

                                  )
                                )}

                              </div>

                            </div>

                          )}

                        {match.missingSkills &&
                          match.missingSkills.length >
                            0 && (

                            <div className="skill-section">

                              <strong>
                                Skills to Improve
                              </strong>

                              <div className="job-skills">

                                {match.missingSkills.map(
                                  (
                                    skill,
                                    index
                                  ) => (

                                    <span
                                      key={
                                        index
                                      }
                                    >
                                      +{" "}
                                      {skill}
                                    </span>

                                  )
                                )}

                              </div>

                            </div>

                          )}

                        <button
                          className="primary-button"
                          onClick={() => {

                            const job =
                              jobs.find(
                                (item) =>
                                  String(
                                    item.id
                                  ) ===
                                  String(
                                    match.jobId
                                  )
                              );

                            if (job) {
                              openApplyModal(
                                job
                              );
                            }

                          }}
                        >
                          View & Apply
                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>
          )}

          {/* =================================================
              APPLICATIONS
          ================================================= */}

          {page === "applications" &&
            user?.role === "STUDENT" && (

            <div className="applications-page">

              <div className="page-heading">

                <div>

                  <h1>
                    My Applications
                  </h1>

                  <p>
                    Track your placement
                    applications.
                  </p>

                </div>

              </div>

              <div className="table-card">

                {applications.length === 0 ? (

                  <div className="empty-state">

                    <h3>
                      No applications yet
                    </h3>

                    <p>
                      Apply for jobs to track
                      your applications here.
                    </p>

                  </div>

                ) : (

                  <div className="application-list">

                    {applications.map(
                      (application) => (

                        <div
                          className="application-row"
                          key={
                            application.id
                          }
                        >

                          <div>

                            <h3>
                              {application.job
                                ?.jobTitle ||
                                application.jobTitle ||
                                "Job Application"}
                            </h3>

                            <p>
                              {application.job
                                ?.companyName ||
                                application.companyName ||
                                "Company"}
                            </p>

                          </div>

                          <span className="status-badge">
                            {application.status ||
                              "PENDING"}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>
          )}

          {/* =================================================
              STUDENT INTERVIEWS
          ================================================= */}

          {page === "interviews" &&
            user?.role === "STUDENT" && (

            <div className="interviews-page">

              <div className="page-heading">

                <div>

                  <h1>
                    Interviews
                  </h1>

                  <p>
                    View your upcoming
                    placement interviews.
                  </p>

                </div>

              </div>

              <div className="interview-list">

                {interviews.length === 0 ? (

                  <div className="table-card">

                    <div className="empty-state">

                      <h3>
                        No interviews scheduled
                      </h3>

                      <p>
                        Your scheduled interviews
                        will appear here.
                      </p>

                    </div>

                  </div>

                ) : (

                  interviews.map(
                    (interview) => (

                      <div
                        className="interview-card"
                        key={
                          interview.id
                        }
                      >

                        <div>

                          <h2>
                            {interview.application
                              ?.job
                              ?.jobTitle ||
                              "Interview"}
                          </h2>

                          <p>
                            🏢{" "}
                            {interview.application
                              ?.job
                              ?.companyName ||
                              "Company"}
                          </p>

                          <p>
                            📅{" "}
                            {interview.interviewDate ||
                              "Date not available"}
                          </p>

                          <p>
                            🕐{" "}
                            {interview.interviewTime ||
                              "Time not available"}
                          </p>

                          <p>
                            💻{" "}
                            {interview.mode ||
                              "Online"}
                          </p>

                          <p>
                            📍{" "}
                            {interview.location ||
                              "Location not available"}
                          </p>

                        </div>

                        <span className="status-badge">
                          {interview.status ||
                            "SCHEDULED"}
                        </span>

                        <span className="result-badge">
                          Result:{" "}
                          {interview.result ||
                            "Pending"}
                        </span>

                      </div>

                    )
                  )

                )}

              </div>

            </div>
          )}

          {/* =================================================
              PLACEMENT READINESS
          ================================================= */}

          {page === "readiness" &&
            user?.role === "STUDENT" && (

            <div className="readiness-page">

              <div className="page-heading">

                <div>

                  <h1>
                    Placement Readiness
                  </h1>

                  <p>
                    Understand how prepared you are
                    for placement opportunities.
                  </p>

                </div>

              </div>

              <div className="readiness-card">

                {/* Overall Score */}

                <div className="readiness-score">

                  <div className="readiness-circle">

                    <strong>
                      {readiness?.overallScore != null
                        ? Math.round(
                            readiness.overallScore
                          )
                        : 0}
                      %
                    </strong>

                    <span>
                      Overall
                    </span>

                  </div>

                  <div>

                    <h2>
                      {readiness?.readinessLevel ||
                        "Not Available"}
                    </h2>

                    <p>
                      Your placement readiness is
                      calculated using your academic
                      performance, technical skills,
                      profile information, applications
                      and interviews.
                    </p>

                  </div>

                </div>

                {/* Score Breakdown */}

                <div className="readiness-breakdown">

                  <div>

                    <span>
                      Academic
                    </span>

                    <strong>
                      {readiness?.academicScore != null
                        ? Math.round(
                            readiness.academicScore
                          )
                        : 0}
                      %
                    </strong>

                  </div>

                  <div>

                    <span>
                      Technical Skills
                    </span>

                    <strong>
                      {readiness?.skillScore != null
                        ? Math.round(
                            readiness.skillScore
                          )
                        : 0}
                      %
                    </strong>

                  </div>

                  <div>

                    <span>
                      Profile
                    </span>

                    <strong>
                      {readiness?.profileScore != null
                        ? Math.round(
                            readiness.profileScore
                          )
                        : 0}
                      %
                    </strong>

                  </div>

                  <div>

                    <span>
                      Applications
                    </span>

                    <strong>
                      {readiness?.applicationScore != null
                        ? Math.round(
                            readiness.applicationScore
                          )
                        : 0}
                      %
                    </strong>

                  </div>

                  <div>

                    <span>
                      Interviews
                    </span>

                    <strong>
                      {readiness?.interviewScore != null
                        ? Math.round(
                            readiness.interviewScore
                          )
                        : 0}
                      %
                    </strong>

                  </div>

                </div>

              </div>

              {/* Improvement Suggestions */}

              <div className="readiness-card">

                <div className="page-heading">

                  <div>

                    <h2>
                      💡 Improvement Suggestions
                    </h2>

                    <p>
                      Focus on these areas to improve
                      your placement readiness.
                    </p>

                  </div>

                </div>

                <div className="readiness-suggestions">

                  {readiness?.academicScore < 70 && (

                    <div className="suggestion-item">

                      <strong>
                        📚 Improve Academic Performance
                      </strong>

                      <p>
                        Maintain a strong CGPA and
                        academic record to meet more
                        company eligibility requirements.
                      </p>

                    </div>

                  )}

                  {readiness?.skillScore < 70 && (

                    <div className="suggestion-item">

                      <strong>
                        💻 Improve Technical Skills
                      </strong>

                      <p>
                        Add relevant technical skills
                        and strengthen your knowledge
                        in technologies required by
                        recruiters.
                      </p>

                    </div>

                  )}

                  {readiness?.profileScore < 70 && (

                    <div className="suggestion-item">

                      <strong>
                        👤 Complete Your Profile
                      </strong>

                      <p>
                        Keep your student profile,
                        academic information and
                        other details complete and
                        up to date.
                      </p>

                    </div>

                  )}

                  {readiness?.applicationScore < 70 && (

                    <div className="suggestion-item">

                      <strong>
                        📨 Apply to More Suitable Jobs
                      </strong>

                      <p>
                        Explore eligible opportunities
                        and apply for jobs that match
                        your skills.
                      </p>

                    </div>

                  )}

                  {readiness?.interviewScore < 70 && (

                    <div className="suggestion-item">

                      <strong>
                        🎤 Prepare for Interviews
                      </strong>

                      <p>
                        Practice technical and HR
                        interview questions and prepare
                        for upcoming interviews.
                      </p>

                    </div>

                  )}

                  {readiness?.overallScore >= 70 && (

                    <div className="suggestion-item">

                      <strong>
                        🎉 You are making good progress!
                      </strong>

                      <p>
                        Continue improving your skills
                        and applying to suitable
                        placement opportunities.
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              APPLY MODAL
          ================================================= */}

          {showApplyModal &&
            selectedJob && (

            <div
              className="modal-overlay"
              onClick={() =>
                setShowApplyModal(false)
              }
            >

              <div
                className="modal-card"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowApplyModal(
                      false
                    )
                  }
                >
                  ×
                </button>

                <h2>
                  Apply for Job
                </h2>

                <h3>
                  {
                    selectedJob.jobTitle
                  }
                </h3>

                <p>
                  {
                    selectedJob.companyName
                  }
                </p>

                <p>
                  Your application will be
                  submitted to the placement
                  system.
                </p>

                <div className="modal-actions">

                  <button
                    className="secondary-button"
                    onClick={() =>
                      setShowApplyModal(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="primary-button"
                    onClick={
                      applyForJob
                    }
                  >
                    Confirm Application
                  </button>

                </div>

              </div>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

/* =========================================================
   HELPER
========================================================= */

function allSkillsCount() {
  return Object.values(
    skillCategories
  )
    .flat()
    .filter(
      (value, index, array) =>
        array.indexOf(value) === index
    ).length;
}

export default App;