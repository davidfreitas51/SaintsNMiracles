using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MiraclesController(IMiraclesRepository miraclesRepository, IMiraclesService miraclesService) : ControllerBase
{
}
