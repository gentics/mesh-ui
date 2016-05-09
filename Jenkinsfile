node('dockerSlave') {
   stage 'Checkout'
   checkout scm
   def mvnHome = tool 'M3'

   stage 'Build'
   sshagent(['601b6ce9-37f7-439a-ac0b-8e368947d98d']) {
     sh "${mvnHome}/bin/mvn -B -Dmaven.test.failure.ignore clean install"
     step([$class: 'JUnitResultArchiver', testResults: '**/junit.xml'])
   }
}
