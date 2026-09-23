const uiConfig = {
  app: {
    name: "Senior Project Portal",
    orgName: "Department of Software Engineering",
    url: {
      API_GET_HTML: "/api/getHtml",
    },
    logoLight: "/assets/logo-light.png",
    logoDark: "/assets/logo-dark.png",
  },
  logoPath:
    "/assets/Golisano _College of_Computing_and_Information_Sciences_LOGO.jpg",
  footers: {
    loggedOut: {
      address:
        "Department of Software Engineering\nGolisano Building 70, Room 1690\n134 Lomb Memorial Drive\nRochester, NY 14623-5608",
      email: "seniorprojects@se.rit.edu",
      copyright: "Rochester Institute of Technology, All Rights Reserved",
    },
    loggedIn: {
      copyright: "Rochester Institute of Technology, All Rights Reserved",
      version: "1.9.1",
      githubLink:
        "https://github.com/RIT-Software-Engineering/RIT-SE-Senior-Project",
    },
  },
};

export default uiConfig;
