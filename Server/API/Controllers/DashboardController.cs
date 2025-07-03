using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DashboardController(ISaintsRepository saintsRepository) : ControllerBase
{
    [HttpGet("saints")]
    public async Task<IActionResult> TotalSaints()
    {
        var totalSaints = await saintsRepository.GetTotalSaintsAsync();
        return Ok(totalSaints);
    }

    [HttpGet]
    public async Task<IActionResult> TotalMiracles()
    {
        return Ok(0);
    }

    [HttpGet]
    public async Task<IActionResult> TotalUsers()
    {
        return Ok(0);
    }
}
