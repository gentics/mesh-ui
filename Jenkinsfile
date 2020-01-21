// The GIT repository for this pipeline lib is defined in the global Jenkins setting
@Library('jenkins-pipeline-library')
import com.gentics.*

// Make the helpers aware of this jobs environment
JobContext.set(this)

final def dockerRegistry       = "gtx-docker-jenkinsbuilds.docker.apa-it.at"
final def dockerImageName      = dockerRegistry + "/gentics/jenkinsbuilds/mesh-slave-ui"

properties([
	parameters([
		booleanParam(name: 'unittest', defaultValue: true, description: "Run unit tests"),
		booleanParam(name: 'e2etest', defaultValue: true, description: "Run e2e tests with testcafe"),
		booleanParam(name: 'release', defaultValue: false, description: "Whether to run the release steps.")
	])
])

final def gitCommitTag = '[Jenkins | ' + env.JOB_BASE_NAME + ']'
def version = null

node("docker") {
	stage("Setup Build Environment") {
		checkout scm
		
		withDockerRegistry([ credentialsId: "repo.gentics.com", url: "https://" + dockerRegistry + "/v2" ]) {
			sh "docker pull " + dockerImageName + " || true"
			sh "cd .jenkins && docker build -t " + dockerImageName + " ."
			sh "cd .jenkins && docker push " + dockerImageName
		}
		
		podTemplate(containers: [
			containerTemplate(alwaysPullImage: true,
				command: 'cat',
				image: dockerImageName,
				name: 'buildenv',
				privileged: false,
				ttyEnabled: true,
				resourceRequestCpu: '1000m',
				resourceRequestMemory: '1048Mi'
				)],
				label: 'mesh-ui',
				name: 'jenkins-slave-mesh-ui',
				namespace: 'jenkins', 
				nodeSelector: 'jenkins_mesh_worker=true',
				serviceAccount: 'jenkins',
				imagePullSecrets: ['docker-jenkinsbuilds-apa-it'],
				volumes: [
					emptyDirVolume(memory: false, mountPath: '/var/run'),
					hostPathVolume(hostPath: '/opt/kubernetes/cache/maven', mountPath: '/ci/.m2/repository'),
					hostPathVolume(hostPath: '/opt/junit', mountPath: '/ci/junit'),
					persistentVolumeClaim(claimName: 'jenkins-credentials', mountPath: '/ci/credentials', readOnly: true)
				], 
				workspaceVolume: emptyDirWorkspaceVolume(false)) {
					node("mesh-ui") {
						stage("Checkout") {
							sshagent(["git"]) {
								checkout scm
							}
							echo "Building " + env.BRANCH_NAME
						}

						stage("Install dependencies") {
							container('buildenv') {
								sh "npm ci"
							}
						}

						stage("Set version") {
							if (params.release) {
								def buildVars = readJSON file: 'package.json'
								version = buildVars.version
								sh "./mvnw -B versions:set -DgenerateBackupPoms=false -DnewVersion=" + version
							} else {
								echo "Not setting version"
							}
						}

						stage("Build") {
							container('buildenv') {
								sh "npm run build"
							}
						}

						stage("Unit Testing") {
							if (params.unittest) {
								try {
									sh "whoami && id"
									container('buildenv') {
										sh "whoami && id"
										sh "mkdir -p /ci/junit/unit && npm run test-ci"
									}
								} finally {
									step([$class: 'JUnitResultArchiver', testResults: '/opt/junit/**/*.xml'])
								}
							}
						}

						stage("e2e Testing") {
							if (params.e2etest) {
								// TODO Start Mesh
								container('buildenv') {
									sh "npm run e2e-ci"
								}
							}
						}

						stage("Deploy") {
							if (params.release) {
								container('buildenv') {
									sshagent(["git"]) {
										withEnv(["EMAIL=entwicklung@gentics.com", "GIT_AUTHOR_NAME=JenkinsCI", "GIT_COMMITTER_NAME=JenkinsCI"]) {
											GitHelper.addCommit('pom.xml', gitCommitTag + ' Release version ' + version)
											sh "./mvnw -B deploy"
											GitHelper.pushBranch(GitHelper.fetchCurrentBranchName())
										}
									}
								}
							}
						}
					}
				}
	}
}
