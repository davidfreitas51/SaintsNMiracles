using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TestingController : ControllerBase
{
    [HttpGet("test")]
    public IActionResult TestEndpoint()
    {
        return Ok("Funcionou!");
    }
}
