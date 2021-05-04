//import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

plugins {
    kotlin("multiplatform") version "1.3.41"
}

repositories {
    mavenLocal()
    mavenCentral()
    jcenter()
    //maven { url 'https://dl.bintray.com/guardian/kotlin' }
}

kotlin {
    jvm("android")
    val iosX64 = iosX64("ios")
    val iosArm64 = iosArm64("iosArm64")
    val iosArm32 = iosArm32("iosArm32")

    val frameworkName = "ophan"

    configure(listOf(iosX64, iosArm64, iosArm32)) {
        binaries.framework {
            baseName = frameworkName
        }
    }
    /*
    ios {
        binaries.framework {
            baseName = "ophan"
        }
    }
    */
    //val iosX64 = iosX64("ios")
    //val iosArm64 = iosArm64("ios64")
    //val iosArm32 = iosArm32("ios32")

    /*
    val frameworkName = "ophan"

    configure(listOf(iosX64, iosArm64)) {
        binaries.framework {
            baseName = frameworkName
        }
    }
    */

    val coroutinesVersion = "1.3.0"
    val ktorVersion = "1.2.3"
    val multiplatformOphanVersion = "0.1.12"

    sourceSets {
        named("commonMain") {
            dependencies {
                implementation(kotlin("stdlib-common"))
                implementation("io.ktor:ktor-client-core:$ktorVersion")
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:$coroutinesVersion")
                api("com.gu.kotlin:multiplatform-ophan:$multiplatformOphanVersion")
            }
        }
        named("androidMain") {
            dependencies {
                implementation(kotlin("stdlib"))
                implementation("io.ktor:ktor-client-android:$ktorVersion")
            }
        }
        val iosMain by getting {

        }
        val iosArm64Main by getting {
            dependsOn(iosMain)
        }
        val iosArm32Main by getting {
            //dependsOn(iosMain)
        }
        /*
        val iosMain by getting {
        }
        val ios64Main by getting {
            dependsOn(iosMain)
        }
         */
        //val ios32Main by getting {
        //    dependsOn(iosMain)
        //}
    }
}
/*
task fatFramework(type: FatFrameworkTask) {
    def buildType = project.findProperty('kotlin.build.type') ?: 'DEBUG'
    def validArchs = project.findProperty('kotlin.valid.archs') ?: 'x86_64'
    println("validArchs=" + validArchs)
    baseName = "ophan"
    destinationDir = file("$buildDir/bin/ios/universalFramework")
    if (validArchs == 'x86_64') {
        from(
                kotlin.targets.ios.binaries.getFramework(buildType),
                kotlin.targets.ios32.binaries.getFramework(buildType),
                kotlin.targets.ios64.binaries.getFramework(buildType)
        )
    } else {
        from(
                kotlin.targets.ios32.binaries.getFramework(buildType),
                kotlin.targets.ios64.binaries.getFramework(buildType)
        )
    }
}

// This task attaches native framework built from ios module to Xcode project
// (see iosApp directory). Don't run this task directly,
// Xcode runs this task itself during its build process.
// Before opening the project from iosApp directory in Xcode,
// make sure all Gradle infrastructure exists (gradle.wrapper, gradlew).
task copyFramework {
    def buildType = project.findProperty('kotlin.build.type') ?: 'DEBUG'
    def target = project.findProperty('kotlin.target') ?: 'ios'
    dependsOn kotlin.targets."$target".binaries.getFramework(buildType).linkTask

    doLast {
        def srcFile = kotlin.targets."$target".binaries.getFramework(buildType).outputFile
        def targetDir = getProperty('configuration.build.dir')
        copy {
            from srcFile.parent
            into targetDir
            include 'app.framework/**'
            include 'app.framework.dSYM'
        }
    }
}

task copyFatFramework {
    dependsOn tasks.fatFramework

    doLast {
        def srcFile = tasks.fatFramework.outputs.files
        def targetDir = getProperty('configuration.build.dir')
        copy {
            from srcFile
            into targetDir
        }
    }
}
*/

//configurations {
 //   compileClasspath
//}
