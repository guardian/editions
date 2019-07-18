package greeting

actual object Platform {
    actual fun name(): String = "iOS"
}