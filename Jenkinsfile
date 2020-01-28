@Library('jenkins-pipeline-library') import com.gentics.*

JobContext.set(this)

pipeline {
    agent {
        kubernetes {
            label env.BUILD_TAG.take(63)
            defaultContainer 'build'
            yamlFile '.jenkins/pod.yaml'
        }
    }

    parameters {
        booleanParam(name: 'unittest', defaultValue: true, description: "Run unit tests")
        booleanParam(name: 'e2etest', defaultValue: true, description: "Run e2e tests with testcafe")
        choice(name: 'release', choices: ['none', 'patch', 'minor', 'major'], description: "Release the UI")
    }

    options {
        withCredentials([
            usernamePassword(credentialsId: 'repo.gentics.com', usernameVariable: 'repoUsername', passwordVariable: 'repoPassword'),
            usernamePassword(credentialsId: 'gentics.gpg', usernameVariable: 'gpgKeyName', passwordVariable: 'gpgKeyPass'),
            string(credentialsId: 'sonarcube.key', variable: 'SONARCUBE_TOKEN'),
            string(credentialsId: 'sonarcloud.key', variable: 'SONARCLOUD_TOKEN')
        ])
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        gitLabConnection('git.gentics.com')
        gitlabBuilds(builds: ['Jenkins build'])
        ansiColor('xterm')
    }

    environment {
        DOCKER_TAG = "${env.GIT_BRANCH}"
        GITLAB_WEBHOOK_SECRETTOKEN = credentials('gitlab-webhook-secrettoken')
    }

    triggers {
        gitlab(
            triggerOnPush: true,
            triggerOnMergeRequest: true,
            triggerOpenMergeRequestOnPush: 'source',
            triggerOnNoteRequest: true,
            noteRegex: 'Jenkins please retry a build',
            ciSkip: true,
            skipWorkInProgressMergeRequest: true,
            addNoteOnMergeRequest: true,
            setBuildDescription: true,
            branchFilterType: 'All',
            secretToken: env.GITLAB_WEBHOOK_SECRETTOKEN)
    }

    stages {
        stage("Install dependencies") {
            steps {
                script {
                    githubBuildStarted()
                    sh "npm ci"
                }
            }
        }

        stage("Build") {
            steps {
                script {
                    sh "npm run build"
                }
            }
        }

        stage("Test") {
            parallel {
                stage("Unit Test") {
                    when {
                        expression {
                            return params.unittest
                        }
                    }
                    steps {
                        script {
                            sh "npm run test-ci"
                        }
                    }

                }

                stage("e2e Test") {
                    when {
                        expression {
                            return params.e2etest
                        }
                    }
                    steps {
                        sh "npm run mesh-ci && npm run e2e-ci"
                    }
                }
            }
        }

        stage("Deploy") {
            when {
                expression {
                    return params.release != null && params.release != 'none'
                }
            }

            steps {
                script {
                    def tagName = sh "npm version ${params.release}"
                    sshagent(["git"]) {
                        def branchName = GitHelper.fetchCurrentBranchName()
                        GitHelper.pushBranch(branchName)

                        if (tagName != null) {
                            GitHelper.pushTag(tagName)
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                githubBuildEnded()
            }
            junit testResults: "reports/**/*.xml"
            notifyMattermostUsers()
        }
    }
}


