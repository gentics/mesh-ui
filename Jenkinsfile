final def gitCommitTag = '[Jenkins | ' + env.JOB_BASE_NAME + ']';

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
				sh "npm run install"
				sh "npm run test"
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
				sh "npm run bump-version"
				def buildVars = readJSON file: 'build-vars.json'
        		def version = buildVars.VERSION
				sh "npm run install"
				sh "npm run dist"
				sh "mvn versions:set -DnewVersion=" + version
				sh "mvn deploy"
				GitHelper.addCommit('.', gitCommitTag + ' Release version ' + version)
				GitHelper.addTag(version, 'Release version ' + version)
				GitHelper.pushTag(version)
				GitHelper.pushBranch(GitHelper.fetchCurrentBranchName())
			}
		}
	}
}
