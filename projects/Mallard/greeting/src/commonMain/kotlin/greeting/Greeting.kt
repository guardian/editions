package greeting

expect object Platform {
    fun name(): String
}

fun hello(): String = "Hello from ${Platform.name()}!"