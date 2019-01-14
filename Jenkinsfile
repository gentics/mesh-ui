// The GIT repository for this pipeline lib is defined in the global Jenkins setting
@Library('jenkins-pipeline-library')
import com.gentics.*

// Make the helpers aware of this jobs environment
JobContext.set(this)

properties([
	parameters([
		booleanParam(name: 'release', defaultValue: false, description: "Whether to run the release steps.")
	])
])

final def gitCommitTag = '[Jenkins | ' + env.JOB_BASE_NAME + ']'
def version = null

node('jenkins-slave') {
	sshagent(["git"]) {
		stage("Checkout") {
			checkout scm
			echo "Building " + env.BRANCH_NAME
		}

		stage("Install dependencies") {
			sh "npm install"
			echo "Preparing basepath"
			sed -i  's/href="\(.*\)\"/href=\"\/ui\"/' src/index.html 
		}

		stage("Set version") {
			if (params.release) {
				def buildVars = readJSON file: 'package.json'
				version = buildVars.version
				sh "mvn versions:set -DgenerateBackupPoms=false -DnewVersion=" + version
			} else {
				echo "Not setting version"
			}
		}

		stage("Build") {
			try {
				sh "npm run build"
			} finally {
				step([$class: 'JUnitResultArchiver', testResults: 'dist/junit.xml'])
			}
		}

		stage("Deploy") {
			if (params.release) {
				GitHelper.addCommit('.', gitCommitTag + ' Release version ' + version)
				GitHelper.addTag(version, 'Release version ' + version)
				sh "mvn deploy"
				GitHelper.pushTag(version)
				GitHelper.pushBranch(GitHelper.fetchCurrentBranchName())
			}
		}
	}
}
