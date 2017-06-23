
properties([
	parameters([
		booleanParam(name: 'release', defaultValue: false, description: "Whether to run the release steps.")
	])
])

if (!Boolean.valueOf(params.release)) {
	stage("Release Build") {
		echo "Skipped"
	}
	
	stage("Build") {
		echo "Building " + env.BRANCH_NAME
		node('jenkins-slave') {
			checkout scm
			try {
				sh "mvn -B clean test -Dmaven.test.failure.ignore"
			} finally {
				step([$class: 'JUnitResultArchiver', testResults: 'build/junit.xml'])
			}
		}
	}
} else {
	node('jenkins-slave') {
	    checkout scm
	    stage("Release Build") {
			sshagent(["git"]) {
				sh "mvn -B release:prepare release:perform -Dresume=false -DignoreSnapshots=true -Darguments=\"-DskipTests\""
			}
		}
	}
}
