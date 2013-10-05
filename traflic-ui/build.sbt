name := """traflic-ui"""

version := "1.0-SNAPSHOT"

resolvers ++= Seq(
  "Java.net repository" at "http://download.java.net/maven/2",
  "Open Source Geospatial Foundation Repository" at "http://download.osgeo.org/webdav/geotools/"
)

libraryDependencies ++= Seq(
  // Select Play modules
  //jdbc,      // The JDBC connection pool and the play.api.db API
  //anorm,     // Scala RDBMS Library
  //javaJdbc,  // Java database API
  //javaEbean, // Java Ebean plugin
  //javaJpa,   // Java JPA plugin
  //filters,   // A set of built-in filters
  javaCore,  // The core Java API
  // WebJars pull in client-side web libraries
  "org.webjars" %% "webjars-play" % "2.2.0",
  "org.webjars" % "bootstrap" % "2.3.1",
  "org.geotools" % "gt-wfs" % "10.0",
  "org.geotools" % "gt-opengis" % "10.0",
  "org.geotools" % "gt-jts-wrapper" % "10.0",
  "org.geotools" % "gt-epsg-hsql" % "10.0",
  "org.geotools" % "gt-geojson" % "10.0",
  "com.vividsolutions" % "jts" % "1.12"
)

play.Project.playScalaSettings

closureCompilerOptions := Seq("rjs")
